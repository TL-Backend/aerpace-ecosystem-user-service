const { Model } = require('sequelize');
const {
  sequelize,
  aergov_roles,
  aergov_user_roles,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { redisKeys } = require('../../utils/constant');
const { logger } = require('../../utils/logger');
const { statusCodes } = require('../../utils/statusCode');
const { errorResponses, successResponses } = require('./role.constant');
const {
  listRolesQuery,
  listMasterRolesQuery,
  getFeaturesByIdentifiersQuery,
  getRolesAndUserWithRole,
} = require('./roles.querie');

const Redis = require('ioredis');
const redis = new Redis();

const { Sequelize, Op } = require('sequelize');

exports.listRolesHelper = async (search = '') => {
  try {
    let params = {};
    if (search) {
      params.search = search;
    }
    let searchValues = params.search ? `%${params.search}%` : null;
    const fetchRolesQuery = listRolesQuery(params);
    const roles = await sequelize.query(fetchRolesQuery,{
      replacements: {
        search: searchValues
      }
    });
    return {
      success: true,
      data: { roles: roles[0] },
      message: successResponses.ROLES_FETCHED,
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

    if (!success) {
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
    const pagesAndFeatures = await sequelize.query(listMasterRolesQuery);

    if (
      pagesAndFeatures[0][0].pages === null ||
      pagesAndFeatures[0][0].features === null
    ) {
      return {
        success: false,
        data: null,
        message: errorResponses.PAGES_OR_FEATURES_NOT_FOUND,
      };
    }

    const masterRolesData = this.pagesAndFeaturesToMasterPermissionTree(
      pagesAndFeatures[0][0],
    );

    await redis.set(
      redisKeys.MASTER_ROLES_TREE,
      JSON.stringify(masterRolesData),
    );

    return {
      success: true,
      data: masterRolesData,
      message: successResponses.MASTER_TREE_GENERATED,
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      data: null,
      message: err.message,
    };
  }
};

exports.getMasterPermissionsTree = async () => {
  try {
    let masterPermissionTree = await redis.get(redisKeys.MASTER_ROLES_TREE);

    if (masterPermissionTree) {
      return {
        success: true,
        data: JSON.parse(masterPermissionTree),
      };
    }

    const { success, message, data } = await this.addMasterPermissionsToCache();
    if (!success) {
      return {
        success: false,
        data: null,
        message: message,
      };
    }
    return {
      success: true,
      data: JSON.parse(data),
      message: successResponses.PERMISSION_TREE_FETCHED,
    };
  } catch (err) {
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

exports.getPermissionTree = (masterList, permissions, tree) => {
  masterList.forEach((element) => {
    let features = [];
    if (element.features) {
      features = element.features.filter(feature => permissions.includes(feature.identifier));
    }

    let childPages = [];
    if (element.pages && element.pages.length) {
      this.getPermissionTree(element.pages, permissions, childPages);
    }

    if (features.length || childPages.length || permissions.includes(element.identifier)) {
      let treeNode = {
        page_id: element.page_id,
        name: element.name,
        identifier: element.identifier,
        pages: childPages,
        features: features
      };
      tree.push(treeNode);
    }
  });
};

exports.generatePermissionTree = (permissions, masterList) => {
  let tree = [];
  this.getPermissionTree(masterList, permissions, tree);
  return tree;
};




exports.editRoleHelper = async ({ id, roleName, permissions }) => {
  try {
    const isValidRole = await aergov_roles.findOne({
      where: { id },
    });

    if (!isValidRole) {
      logger.error('Invalid Role id');
      return {
        success: false,
        data: null,
        message: errorResponses.ROLE_NOT_FOUND,
        errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
      };
    }

    if (roleName) {
      const isInvalidRoleName = await aergov_roles.findOne({
        where: {
          role_name: roleName,
          id: {
            [Sequelize.Op.ne]: id, // Replace 'yourSpecificId' with the desired ID
          },
        },
      });

      if (isInvalidRoleName) {
        logger.error(
          'Role already exists with this name, please try with new name',
        );
        return {
          success: false,
          errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
          message: errorResponses.NAME_EXISTS,
          data: null,
        };
      }
    }

    if (permissions) {
      const uniquePermissions = [...new Set(permissions)];

      const featuresExists = await sequelize.query(
        getFeaturesByIdentifiersQuery,
        { replacements: { permissions: uniquePermissions } },
      );

      if (!featuresExists[0][0]?.result) {
        logger.error('Invalid set permissions');
        return {
          success: false,
          errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
          message: errorResponses.INVALID_FEATURES,
          data: null,
        };
      }

      const { success, data, message } = await this.getMasterPermissionsTree();

      if (!success) {
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

      await aergov_roles.update(
        {
          role_name: roleName,
          permission_list: uniquePermissions,
          permission_tree: permission_tree,
        },
        { where: { id } },
      );

      return {
        success: true,
        data: { role_id: id },
        message: successResponses.ROLE_UPDATED,
      };
    }

    await aergov_roles.update(
      {
        role_name: roleName,
      },
      { where: { id } },
    );

    return {
      success: true,
      data: { role_id: id },
      message: successResponses.ROLE_UPDATED,
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      data: null,
      message: errorResponses.INTERNAL_ERROR,
    };
  }
};

exports.deleteRoleHelper = async (roleId) => {
  try {
    const roleData = await aergov_roles.findOne({
      where: {
        id: roleId,
      },
    });
    if (!roleData) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: errorResponses.ROLE_NOT_FOUND,
        data: null,
      };
    }
    const userRoleData = await aergov_user_roles.findAll({
      where: {
        role_id: roleId,
      },
    });
    if (userRoleData.length > 0) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: errorResponses.ROLE_ASSIGNED_TO_USER,
        data: null,
      };
    }
    await aergov_roles.destroy({
      where: {
        id: roleId,
      },
    });
    return {
      success: true,
      errorCode: statusCodes.STATUS_CODE_SUCCESS,
      message: successResponses.ROLE_DELETED,
      data: null,
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
