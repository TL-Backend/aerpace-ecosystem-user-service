const {
  errorResponse,
  successResponse,
} = require('../../utils/responseHandler');
const {
  addUserHelper,
  editUserHelper,
  getUsersListHelper,
  hardDeleteUserHelper,
} = require('./user.helper');
const { statusCodes } = require('../../utils/statusCode');
const { logger } = require('../../utils/logger');
const messages = require('./user.constant');

exports.addUser = async (req, res) => {
  try {
    const userDetails = req.body;
    const user = await addUserHelper(userDetails);
    if (!user.success) {
      logger.error(user.data);
      return errorResponse({
        req,
        res,
        code: user.errorCode || statusCodes.STATUS_CODE_FAILURE,
        error: user.data,
        message: user.message,
      });
    }
    return successResponse({
      data: user.data,
      req,
      res,
      message: messages.successMessages.USER_ADDED_MESSAGE,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err.message);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};

exports.editUser = async (req, res) => {
  try {
    const userDetails = req.body;
    const user = await editUserHelper(userDetails, req.params.id);
    if (!user.success) {
      logger.error(user.data);
      return errorResponse({
        req,
        res,
        code: user.errorCode || statusCodes.STATUS_CODE_FAILURE,
        error: user.data,
        message: user.message,
      });
    }
    return successResponse({
      data: userDetails,
      req,
      res,
      message: messages.successMessages.USER_UPDATED_MESSAGE,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err.message);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};

exports.getUsersList = async (req, res) => {
  try {
    const { search, page_limit, page_number, role, location } = req.query;
    const user = await getUsersListHelper({ search_key: search, page_limit, page_number, role, location });
    if (!user.success) {
      logger.error(user.data);
      return errorResponse({
        req,
        res,
        code: statusCodes.STATUS_CODE_FAILURE,
        error: user.data,
      });
    }
    return successResponse({
      data: user.data,
      req,
      res,
      message: messages.successMessages.USERS_FETCHED_MESSAGE,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err.message);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};

exports.hardDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { success, errorCode, message } = await hardDeleteUserHelper({ id });
    if (!success) {
      return errorResponse({
        req,
        res,
        code: errorCode,
        message: message,
      });
    }
    return successResponse({
      req,
      res,
      message: message,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err.message);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};
