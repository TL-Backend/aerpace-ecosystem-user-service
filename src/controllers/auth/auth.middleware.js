const { errorResponse } = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCodes');
const { errorResponses } = require('./auth.constant');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { logger } = require('../../utils/logger');

exports.loginValidation = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errorsList = [];
    if (!email || typeof email !== 'string') {
      errorsList.push(errorResponses.EMAIL_INVALID);
    }
    if (!password || typeof password !== 'string') {
      errorsList.push(errorResponses.PASSWORD_INVALID);
    }
    if (errorsList.length) {
      throw errorsList.join();
    }
    next();
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

exports.forgotPasswordValidations = async (req, res, next) => {
  try {
    const { email } = req.body;
    const errorsList = [];
    if (!email || typeof email !== 'string') {
      errorsList.push(errorResponses.EMAIL_INVALID);
    }
    if (errorsList.length) {
      throw errorsList.join();
    }
    next();
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

exports.resetPasswordValidations = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const { new_password: password } = req.body;
    const errorsList = [];
    if (typeof uuid !== 'string') {
      errorsList.push(errorResponses.UUID_INVALID);
    }
    if (!password || typeof password !== 'string') {
      errorsList.push(errorResponses.PASSWORD_INVALID);
    }
    if (errorsList.length) {
      throw errorsList.join();
    }
    next();
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

exports.refreshTokenValidation = async (req, res, next) => {
  try {
    const errorsList = [];
    const authorization = req.headers.authorization;
    if (!authorization) {
      errorsList.push(errorResponses.TOKEN_INVALID);
    }
    if (errorsList.length) {
      throw errorsList.join();
    }
    next();
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      err,
      message: err,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
};
