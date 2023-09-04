const {
  successResponse,
  errorResponse,
} = require('../../utils/responseHandler');
const { listRolesHelper, addRole } = require('./roles.helper');
const { statusCodes } = require('../../utils/statusCodes');
const { logger } = require('../../utils/logger');
const { errorResponses } = require('./roles.constants');

exports.listRoles = async (req, res, next) => {
  try {
    const { search } = req.query;
    const { data, success, message, code } = await listRolesHelper(search);
    if (!success) {
      return errorResponse({
        req,
        res,
        message: message,
        code: code,
      });
    }

    return successResponse({
      req,
      res,
      data: data,
      message: message,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      message: errorResponses.INTERNAL_ERROR,
      code: 500,
    });
  }
};

exports.createRole = async (req, res, next) => {
  try {
    const { data, success, message, code } = await addRole(req.body);
    if (!success) {
      return errorResponse({
        req,
        res,
        message,
        code,
      });
    }
    return successResponse({
      req,
      res,
      data,
      message,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      message: err.message,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};
