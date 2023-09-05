const {
  errorResponse,
  successResponse,
} = require('../../utils/responseHandler');
const {
  addUserHelper,
  editUserHelper,
  getUsersListHelper,
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
        code: statusCodes.STATUS_CODE_FAILURE,
        error: user.data,
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
    logger.error(err);
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
        code: statusCodes.STATUS_CODE_FAILURE,
        error: user.data,
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
    logger.error(err);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};

exports.getUsersList = async (req, res) => {
  try {
    const { search, page_limit, page_number } = req.query;
    const user = await getUsersListHelper(search, page_limit, page_number);
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
    logger.error(err);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};
