const { errorResponse } = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCode');
const { errorResponses } = require('./auth.constant');
const { logger } = require('../../utils/logger');
const {
  constants,
} = require('../../services/aerpace-ecosystem-backend-db/src/commons/constant');

exports.loginValidation = async (req, res, next) => {
  try {
    const { email, password, app } = req.body;
    let errorsList = [];
    if (!email || typeof email !== 'string') {
      errorsList.push(errorResponses.EMAIL_INVALID);
    }
    if (!password || typeof password !== 'string') {
      errorsList.push(errorResponses.PASSWORD_INVALID);
    }
    if (!constants.APP_TYPES.includes(app)) {
      errorsList.push(errorResponses.INVALID_APP_TYPE);
    }
    if (errorsList.length) {
      errorsList = [...new Set(errorsList)];
      throw errorsList.join(', ');
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
      throw errorsList.join(', ');
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
      throw errorsList.join(', ');
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
    if (!req.body.refresh_token) {
      errorsList.push(errorResponses.TOKEN_INVALID);
    }
    if (errorsList.length) {
      throw errorsList.join(', ');
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

exports.temporaryPasswordRestValidation = async (req, res, next) => {
  try {
    const errorsList = [];
    const { new_password: password } = req.body;
    if (!password || typeof password !== 'string') {
      errorsList.push(errorResponses.PASSWORD_INVALID);
    }
    if (errorsList.length) {
      throw errorsList.join(', ');
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
