const {
  successResponse,
  errorResponse,
} = require('../../utils/responseHandler');

const { statusCodes } = require('../../utils/statusCodes');
const { logger } = require('../../utils/logger');
const { verifyPassword } = require('../../utils/password-handling.util');
const { generateTokens } = require('./auth.util');
const { expirationTime } = require('../../utils/constants');
const { successResponses, errorResponses } = require('./auth.constants');
const {
  createPasswordResetEntry,
  getUser,
  changeUserPassword,
} = require('./auth.helper');
const { sendEmail } = require('../../utils/email-sender');

exports.login = async (req, res, next) => {
  try {
    let { password: enteredPassword } = req.body;
    enteredPassword = enteredPassword.trim();
    const userData = req.userData;
    const {
      password,
      user_id,
      first_name,
      last_name,
      email,
      phone_number,
      role_id,
      role_name,
    } = userData;
    const isPasswordVerified = await verifyPassword(enteredPassword, password);
    if (isPasswordVerified) {
      const idToken = generateTokens(
        { user_id, role_id, token_type: 'ID_TOKEN' },
        expirationTime.ID_TOKEN,
      );
      const refreshToken = generateTokens(
        { user_id, token_type: 'REFRESH_TOKEN' },
        expirationTime.REFRESH_TOKEN,
      );
      const token = {
        idToken,
        refreshToken,
      };
      const profile_data = {
        first_name,
        last_name,
        email,
        phone_number,
        user_id,
        role_id,
        role_name,
      };
      return successResponse({
        res,
        data: {
          token,
          profile_data,
        },
        message: successResponses.LOGIN_SUCCESSFUL.message,
        code: statusCodes.STATUS_CODE_SUCCESS,
      });
    }
    return errorResponse({
      res,
      code: statusCodes.STATUS_CODE_UNAUTHORIZED,
      message: errorResponses.AUTHENTICATION_ERROR.message,
    });
  } catch (err) {
    logger.error(err);
    return errorResponse({
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      error: err,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    let { email } = req.body;
    email = email.trim();
    const userData = req.userData;
    const { data: reset_uuid } = await createPasswordResetEntry(userData);
    await sendEmail(email, reset_uuid);
    return successResponse({
      res,
      message: successResponses.RESET_LINK_SENT.message,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return errorResponse({
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      error: err,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetData = req.resetData;
    let { new_password } = req.body;
    new_password = new_password.trim();
    const { data: userData } = await getUser(
      { id: resetData.user_id },
      { raw: false },
    );
    const { data: isPasswordUpdated } = await changeUserPassword(
      userData,
      new_password,
    );
    if (!isPasswordUpdated) {
      return errorResponse({
        res,
        code: statusCodes.INVALID_FORMAT,
        message: errorResponses.SAME_PASSWORD_USED_ERROR.message,
      });
    }
    resetData.status = 0;
    await resetData.save();
    return successResponse({
      res,
      message: successResponses.PASSWORD_CHANGED.message,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return errorResponse({
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      error: err,
    });
  }
};

exports.getAccessTokenWithRefresh = async (req, res, next) => {
  try {
    const { id } = req.decodedToken;
    const accessToken = generateTokens(
      { id },
      expirationTime.LOGIN_ACCESS_TOKEN,
    );
    const token = { accessToken };
    return successResponse({
      res,
      data: token,
      message: successResponses.TOKEN_REFRESHED.message,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return errorResponse({
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      error: err,
    });
  }
};
