const {
  errorResponse,
  successResponse,
} = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCode');
const { configHelper } = require('./config.helper');

exports.getConfig = async (req, res, next) => {
  try {
    const { data, success, message, code } = await configHelper({
      userId: req.query.userId,
    });
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
    logger.error(err.message);
    return errorResponse({
      req,
      res,
      message: err.message,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};
