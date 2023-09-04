const {
  sequelize,
  aergov_roles,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { logger } = require('../../utils/logger');
const { statusCodes } = require('../../utils/statusCodes');
const { errorResponses, successResponses } = require('./role.constant');
const {
  listRolesQuery,
  listMasterRolesQuery,
  getFeaturesByIdentifiersQuery,
} = require('./roles.querie');

const Redis = require('ioredis');
const redis = new Redis();

exports.listRolesHelper = async (search = '') => {
  try {
    let params = {};
    if (search != '') {
      params.search = search;
    }
    const fetchRolesQuery = listRolesQuery(params);
    const roles = await sequelize.query(fetchRolesQuery).then((data) => {
      return data[0];
    });
    return {
      success: true,
      data: roles,
      message: successResponses.ROLES_FETCHED,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      data: null,
    };
  }
};

exports.addRole = async (params) => {
  try {
    const { role_name: roleName, permissions } = params;

    const roleWithNameData = await aergov_roles.findAll({
      where: { role_name: roleName },
    });

    if (roleWithNameData.length > 0) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: errorResponses.NAME_EXISTS,
        data: null,
      };
    }

    const uniquePermissions = [...new Set(permissions)];
    const featuresExists = await sequelize.query(
      getFeaturesByIdentifiersQuery,
      { replacements: { permissions: uniquePermissions } },
    );

    if (featuresExists[0][0].result === false) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: errorResponses.INVALID_FEATURES,
        data: null,
      };
    }

    const { success, data, message } = await this.getMasterPermissionsTree();
    console.log('data---', data);
    if (!success) {
      console.log('err', message);
      return {
        success: false,
        message: message || 'failed to fetch master permission tree',
        errorCode: statusCodes.STATUS_CODE_FAILURE,
        data: null,
      };
    }

    const permission_tree = this.generatePermissionTree(
      uniquePermissions,
      data,
    );

    const addRoleInDb = await aergov_roles.create({
      role_name: roleName,
      permission_list: uniquePermissions,
      permission_tree: permission_tree,
    });

    return {
      success: true,
      data: {
        role_id: addRoleInDb.id,
        role_name: addRoleInDb.role_name,
      },
      message: successResponses.ROLE_CREATED,
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      message: err.message,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      data: null,
    };
  }
};

exports.addMasterPermissionsToCache = async () => {
  try {
    const pagesAndFeatures = await sequelize
      .query(listMasterRolesQuery)
      .then((data) => {
        return data[0][0];
      });

    if (pagesAndFeatures.pages === null || pagesAndFeatures.features === null) {
      return false;
    }

    const masterRolesData =
      this.pagesAndFeaturesToMasterPermissionTree(pagesAndFeatures);
    logger.info(`masterRolesData = ${masterRolesData}`);
    await redis.set('masterRolesTree', JSON.stringify(masterRolesData));

    return masterRolesData;
  } catch (err) {
    logger.error(err.message);
    return {};
  }
};

exports.getMasterPermissionsTree = async () => {
  try {
    let masterPermissionTree = await redis.get('masterRolesTree');

    if (masterPermissionTree) {
      return {
        success: true,
        data: JSON.parse(masterPermissionTree),
        message: 'fetched master permission tree successfully',
      };
    }

    masterPermissionTree = await this.addMasterPermissionsToCache();
    return {
      success: true,
      data: JSON.parse(masterPermissionTree),
      message: 'fetched master permission tree successfully',
    };
  } catch (err) {
    logger.error('errrrr', err);
    return {
      success: false,
      data: null,
      message: err.message,
    };
  }
};

exports.pagesAndFeaturesToMasterPermissionTree = (pageAndFeaturesObject) => {
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

exports.getPermissionTree = (masterList, permission, tree) => {
  masterList.forEach((element) => {
    const isPresent = element.features.find((element) => {
      return element.identifier == permission;
    });
    if (isPresent) {
      let index = tree.findIndex(
        (element1) => element1.identifier == element.identifier,
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
    } else if (permission.includes(element.identifier)) {
      let index = tree.findIndex(
        (element1) => element1.identifier == element.identifier,
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

      this.getPermissionTree(element?.pages, permission, tree[index].pages);
    }
  });
};

exports.generatePermissionTree = (permissions, masterList) => {
  let tree = [];
  permissions.forEach((permission) => {
    this.getPermissionTree(masterList, permission, tree);
  });

  return tree;
};
