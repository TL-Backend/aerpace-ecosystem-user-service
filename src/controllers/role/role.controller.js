const {
  successResponse,
  errorResponse,
} = require('../../utils/responseHandler');
const { listRolesHelper, addRole } = require('./role.helper');
const { statusCodes } = require('../../utils/statusCode');
const { logger } = require('../../utils/logger');
const { errorResponses } = require('./role.constant');

exports.listRoles = async (req, res, next) => {
  try {
    const { search } = req.query;
    const { data, success, message, errorCode } = await listRolesHelper(search);
    if (!success) {
      return errorResponse({
        req,
        res,
        message: message,
        code: errorCode,
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
    const { data, success, message, errorCode } = await addRole(req.body);
    if (!success) {
      return errorResponse({
        req,
        res,
        message,
        code: errorCode,
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
