const { errorResponses } = require('./role.constant');
const { logger } = require('../../utils/logger');
const { errorResponse } = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCode');

exports.validateRoleInput = async (req, res, next) => {
  try {
    const { role_name: roleName, permissions } = req.body;
    const errorsList = [];

    if (!roleName?.trim() || typeof roleName !== 'string') {
      errorsList.push(
        errorResponses.INVALID_STRING_OR_MISSING_ERROR('role_name'),
      );
    }

    if (!permissions || typeof permissions !== 'object') {
      errorsList.push(
        errorResponses.INVALID_OBJECT_OR_MISSING_ERROR('permissions'),
      );
    }

    if (permissions) {
      let errors = [];
      permissions.forEach((element) => {
        if (typeof element !== 'string') {
          errors.push('Not string');
        }
      });

      if (errors.length) {
        errorsList.push(
          errorResponses.INVALID_STRING_OR_MISSING_ERROR('permission'),
        );
      }
    }

    if (errorsList.length) {
      throw errorsList.join(' ,');
    }

    return next();
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      error: err,
      message: err,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
};

exports.validateUpdateRoleInput = async (req, res, next) => {
  try {
    const { role_name: roleName, permissions } = req.body;
    const errorsList = [];

    if(!(roleName || permissions)) {
      throw errorResponses.NOTHING_TO_UPDATE;
    }

    if (roleName && ( typeof roleName !== 'string')) {
      errorsList.push(
        errorResponses.INVALID_STRING_OR_MISSING_ERROR('role_name'),
      );
    }

    if (permissions &&  (typeof permissions !== 'object' || !permissions.length )) {
      errorsList.push(
        errorResponses.INVALID_OBJECT_OR_MISSING_ERROR('permissions'),
      );
    }

    if (permissions) {
      let errors = [];
      permissions.forEach((element) => {
        if (typeof element !== 'string') {
          errors.push('Not string');
        }
      });

      if (errors.length) {
        errorsList.push(
          errorResponses.INVALID_STRING_OR_MISSING_ERROR('permission'),
        );
      }
    }

    if (errorsList.length) {
      throw errorsList.join(' ,');
    }

    return next();
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      error: err,
      message: err,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
};
