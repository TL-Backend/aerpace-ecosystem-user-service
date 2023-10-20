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

    const landingPage = this.getLandingPage({
      permissions: rolePermissions[0][0].permission_tree,
    });

    return {
      success: true,
      data: {
        master_permissions: data,
        role: rolePermissions[0][0] || {},
        landing_page: landingPage,
        enums: constants,
      },
      message: successResponses.CONFIG_FETCHED,
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      message: errorResponses.INTERNAL_ERROR,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      data: null,
    };
  }
};


exports.getLandingPage = ({ permissions }) => {
  let landingPage = this.getLandingPageRoute({ permissions: permissions[0] });

  landingPage = landingPage
    ? this.convertToValidRoute({route: landingPage})
    : 'access-denied';

  return landingPage;
};

exports.getLandingPageRoute = ({ permissions }) => {
  if (permissions) {
    if (permissions.pages && permissions.pages.length > 0) {
      let landingPage = this.getLandingPageRoute({
        permissions: permissions.pages[0],
      });
      if (landingPage) return landingPage;
    } else {
      return permissions.name;
    }
  }
  return 'access-denied';
};

exports.convertToValidRoute = ({route}) => {

  const words = route.split(' ');
  const list = `${
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }`;

  return list
};
