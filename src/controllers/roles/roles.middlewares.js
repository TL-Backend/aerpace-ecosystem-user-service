const { errorResponses } = require('./roles.constants');
const { logger } = require('../../utils/logger');
const { errorResponse } = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCodes');

exports.validateRoleInput = async (req, res, next) => {
  try {
    const { role_name, permissions } = req.body;
    const errorsList = [];

    console.log(typeof permissions);

    if (!role_name?.trim() || typeof role_name !== 'string') {
      errorsList.push(
        errorResponses.INVAILD_STRING_OR_MISSING_ERROR('role_name')
      );
    }

    if (!permissions || typeof permissions !== 'object') {
      errorsList.push(
        errorResponses.INVAILD_OBJECT_OR_MISSING_ERROR('permissions')
      );
    }

    if (errorsList.length) {
      throw errorsList;
    }

    return next();
  } catch (error) {
    logger.error(error);
    return errorResponse({
      req,
      res,
      error,
      message: error,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
};
