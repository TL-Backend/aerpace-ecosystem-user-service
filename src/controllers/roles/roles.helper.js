const {
  sequelize,
  aergov_roles,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { logger } = require('../../utils/logger');
const { statusCodes } = require('../../utils/statusCodes');
const { errorResponses, successResponses } = require('./roles.constants');
const {
  listRolesQuery,
  listMasterRolesQuery,
  getFeaturesByIdentifiersQuery,
} = require('./roles.queries');

const Redis = require('ioredis');
const redis = new Redis();

exports.listRolesHelper = async (search = '') => {
  try {
    let params = {};
    if (search != '') {
      params.search = search;
    }
    const fetchRolesQuery = listRolesQuery(params);
    const roles = await sequelize
      .query(fetchRolesQuery)
      .then((data) => {
        return data[0];
      })
      .catch((err) => {
        return err;
      });
    return {
      success: true,
      data: roles,
    };
  } catch (err) {
    return {
      success: false,
      message: errorResponses.INTERNAL_ERROR,
      code: statusCodes.STATUS_CODE_FAILURE,
    };
  }
};

exports.addRole = async (params) => {
  try {
    const { role_name, permissions } = params;

    const uniquePermissions = [...new Set(permissions)];

    const roleWithNameData = await aergov_roles.findAll({
      where: { role_name },
    });

    if (roleWithNameData.length > 0) {
      return {
        success: false,
        code: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: errorResponses.NAME_EXISTS,
      };
    }

    const featuresExists = await sequelize.query(
      getFeaturesByIdentifiersQuery,
      { replacements: { permissions: uniquePermissions } }
    );

    if (featuresExists[0][0].result === false) {
      return {
        success: false,
        code: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: errorResponses.INVALID_FEATURES,
      };
    }

    const master = await getMasterRolesTree();
    const permission_tree = generatePermissionTree(uniquePermissions, master);

    const addRoleInDb = await aergov_roles
      .create({
        role_name,
        permission_list: uniquePermissions,
        permission_tree: permission_tree,
      })
      .catch((err) => {
        logger.error(err);
        return err;
      });

    return {
      success: true,
      data: {
        role_id: addRoleInDb.id,
        role_name: addRoleInDb.role_name,
      },
      message: successResponses.ROLE_CREATED,
      code: statusCodes.STATUS_CODE_SUCCESS,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      message: errorResponses.ROLE_CREATION_FAILED,
      code: statusCodes.STATUS_CODE_FAILURE,
    };
  }
};

exports.addMasterPermissionsToCache = async () => {
  const pagesAndFeatures = await sequelize
    .query(listMasterRolesQuery)
    .then((data) => {
      return data[0][0];
    })
    .catch((err) => {
      logger.error(err);
      return err;
    });

  if(pagesAndFeatures.pages === null || pagesAndFeatures.features === null ) {
    return false
  }

  const masterRolesData = transformPagesAndFeaturesObject(pagesAndFeatures);
  await redis.set('masterRolesTree', JSON.stringify(masterRolesData));

  return masterRolesData
};

getMasterRolesTree = async () => {
  try {
    let masterRolesTree = await redis.get('masterRolesTree');

    if (masterRolesTree) {
      return JSON.parse(masterRolesTree);
    }

    masterRolesTree = await addMasterPermissionsToCache();
    return JSON.parse(masterRolesTree);
  } catch (err) {
    logger.error(err);
    return {
      err,
    };
  }
};

const transformPagesAndFeaturesObject = (pageAndFeaturesObject) => {
  const pageLookup = new Map();
  const rootPages = [];

  // Populate the lookup object and separate root pages
  pageAndFeaturesObject.pages.forEach((page) => {
    page.pages = [];
    page.features = [];
    pageLookup.set(page.id, page);

    if (page.parent_id === null) {
      rootPages.push(page);
    }
  });

  // Populate the nested structure
  pageAndFeaturesObject.pages.forEach((page) => {
    if (page.parent_id !== null) {
      const parentPage = pageLookup.get(page.parent_id);
      parentPage.pages.push(page);
    }
  });

  // Assign features to their respective pages
  pageAndFeaturesObject.features.forEach((feature) => {
    const page = pageLookup.get(feature.page_id);
    if (page) {
      page.features.push(feature);
    }
  });

  return rootPages;
};

const getPermissionTree = (masterList, permission, tree) => {
  masterList.forEach((element) => {
    const isPresent = element.features.find((element) => {
      return element.identifier == permission;
    });
    if (isPresent) {
      let index = tree.findIndex(
        (element1) => element1.identifier == element.identifier
      );

      if (index == -1) {
        tree.push({});
        index = tree.length - 1;
        tree[index].page_id = element.page_id;
        tree[index].name = element.name;
        tree[index].identifier = element.identifier;
        tree[index].pages = [];
        tree[index].features = [isPresent];
      } else {
        tree[index].features.push(isPresent);
      }
    } else {
      if (permission.includes(element.identifier)) {
        let index = tree.findIndex(
          (element1) => element1.identifier == element.identifier
        );

        if (index == -1) {
          tree.push({});
          index = tree.length - 1;
          tree[index].page_id = element.page_id;
          tree[index].name = element.name;
          tree[index].identifier = element.identifier;
          tree[index].pages = [];
          tree[index].features = [];
        }

        getPermissionTree(element?.pages, permission, tree[index].pages);
      }
    }
  });
};

const generatePermissionTree = (permissions, masterList) => {
  let tree = [];
  permissions.forEach((permission) => {
    getPermissionTree(masterList, permission, tree);
  });

  return tree;
};
