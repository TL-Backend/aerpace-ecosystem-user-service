const { errorResponse } = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCodes');
const { errorResponses } = require('./auth.constants');
const { getUser, getResetData, checkResetValidity } = require('./auth.helper');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const loginValidation = [
  check('email')
    .isEmail()
    .withMessage(errorResponses.EMAIL_INVALID.message)
    .custom(async (value, { req, res }) => {
      const { data: activeUserData } = await getUser({ email: value });
      if (!activeUserData) {
        throw new Error(errorResponses.EMAIL_INVALID.message);
      }
      req.userData = activeUserData;
    }),
  check('password')
    .isString()
    .withMessage(errorResponses.PASSWORD_INVALID.message),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse({
        req,
        res,
        code: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: errors.errors[0].msg,
      });
    }
    next();
  },
];

const forgotPasswordValidations = [
  check('email')
    .isEmail()
    .withMessage(errorResponses.EMAIL_INVALID.message)
    .custom(async (value, { req }) => {
      const { data: activeUserData } = await getUser({ email: value });
      if (!activeUserData) {
        throw new Error(errorResponses.EMAIL_INVALID.message);
      }
      req.userData = activeUserData;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse({
        req,
        res,
        code: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: errors.errors[0].msg,
      });
    }
    next();
  },
];

const resetPasswordValidations = [
  check('uuid')
    .isString()
    .withMessage(errorResponses.UUID_INVALID.message)
    .custom(async (value, { req }) => {
      const { data: resetData } = await getResetData(
        { uuid: value },
        { raw: false },
      );
      if (!resetData) {
        throw new Error(errorResponses.UUID_INVALID.message);
      }
      const { data: isResetInfoValid } = await checkResetValidity(resetData);
      if (!isResetInfoValid) {
        throw new Error(errorResponses.INVALID_RESET_LINK.message);
      }
      req.resetData = resetData;
    }),
  check('new_password')
    .isString()
    .withMessage(errorResponses.PASSWORD_INVALID.message),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse({
        req,
        res,
        code: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: errors.errors[0].msg,
      });
    }
    next();
  },
];

const refreshTokenValidation = [
  check('authorization')
    .isString()
    .withMessage(errorResponses.TOKEN_EXPIRED.message)
    .custom(async (value, { req }) => {
      const decodedToken = jwt.verify(
        JSON.parse(value),
        process.env.SECURITY_KEY,
      );
      const tokenExpiration = moment.unix(decodedToken.exp);
      if (moment().isAfter(tokenExpiration)) {
        throw new Error(errorResponses.TOKEN_EXPIRED.message);
      }
      req.decodedToken = decodedToken;
    }),
  (req, res, next) => {
    const errors = validationResult(req.headers.authorization);
    if (!errors.isEmpty()) {
      return errorResponse({
        req,
        res,
        code: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: errors.errors[0].msg,
      });
    }
    next();
  },
];

module.exports = {
  loginValidation,
  forgotPasswordValidations,
  resetPasswordValidations,
  refreshTokenValidation,
};
