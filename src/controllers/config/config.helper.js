const { logger } = require('../../utils/logger');
const { statusCodes } = require('../../utils/statusCode');
const { getMasterPermissionsTree } = require('../role/role.helper');
const { errorResponses, successResponses } = require('./config.constant');
const {
  constants,
} = require('../../services/aerpace-ecosystem-backend-db/src/commons/constant');
const {
  sequelize,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { getRolePermissions } = require('./config.query');

exports.configHelper = async (params) => {
  try {
    const { userId } = params;

    const rolePermissions = await sequelize.query(getRolePermissions, {
      replacements: { userId },
    });

    const { success, data, message } = await getMasterPermissionsTree();
    if (!success) {
      return {
        success: false,
        message,
        errorCode: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
      };
    }

    return {
      success: true,
      data: {
        master_permissions: data,
        role: rolePermissions[0][0]?.permission_tree[0] || {},
        enums: constants,
      },
      message: successResponses.CONFIG_FETCHED,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      message: errorResponses.INTERNAL_ERROR,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      data: null,
    };
  }
};
