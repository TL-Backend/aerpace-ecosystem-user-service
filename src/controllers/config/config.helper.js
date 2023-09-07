const { logger } = require('../../utils/logger');
const { statusCodes } = require('../../utils/statusCode');
const { getMasterPermissionsTree } = require('../role/role.helper');
const { errorResponses, successResponses } = require('./config.constant');
const {
  constants,
} = require('../../services/aerpace-ecosystem-backend-db/src/commons/constant');
const {
  aergov_roles,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');

exports.configHelper = async (params) => {
  try {
    const { roleId } = params;
    const rolePermissions = await aergov_roles.findOne({
      where: { id: roleId },
    });
    const { success, data, message } = await getMasterPermissionsTree();
    if (!success) {
      return {
        success: false,
        message: message,
        errorCode: 404,
      };
    }

    return {
      success: true,
      data: {
        master_permissions: data,
        role: rolePermissions.permission_tree[0],
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
