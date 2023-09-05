const {
  successResponse,
  errorResponse,
} = require('../../utils/responseHandler');

const { statusCodes } = require('../../utils/statusCode');
const { logger } = require('../../utils/logger');
const { verifyPassword } = require('../../utils/passwordHandler');
const { generateTokens } = require('./auth.util');
const { expirationTime } = require('../../utils/constant');
const { successResponses, errorResponses } = require('./auth.constant');
const {
  createPasswordResetEntry,
  getUser,
  changeUserPassword,
  getResetData,
  checkResetValidity,
  decodeRefreshToken,
  getValidUserWithRoleDetails,
} = require('./auth.helper');
const { sendEmail } = require('../../utils/emailSender');

exports.login = async (req, res, next) => {
  try {
    let { email, password: enteredPassword, app } = req.body;
    email = email.trim();
    const {
      success,
      errorCode,
      message,
      data: userData,
    } = await getValidUserWithRoleDetails({ email, app });
    if (!success) {
      return errorResponse({
        req,
        res,
        code: errorCode,
        message,
      });
    }
    const {
      password,
      user_id,
      first_name,
      last_name,
      phone_number,
      role_id,
      role_name,
      profile_url,
      first_time_login,
    } = userData;
    const isPasswordValid = await verifyPassword({
      enteredPassword,
      password,
    });
    if (isPasswordValid) {
      const idToken = generateTokens({
        payload: { user_id, role_id, token_type: 'ID_TOKEN' },
        expiresIn: expirationTime.ID_TOKEN,
      });
      const refreshToken = generateTokens({
        payload: { user_id, token_type: 'REFRESH_TOKEN' },
        expiresIn: expirationTime.REFRESH_TOKEN,
      });
      const profile = {
        first_name,
        last_name,
        email,
        phone_number,
        user_id,
        role_id,
        role_name,
        profile_url,
        first_time_login,
      };
      return successResponse({
        res,
        code: statusCodes.STATUS_CODE_SUCCESS,
        message: successResponses.LOGIN_SUCCESSFUL,
        data: {
          idToken,
          refreshToken,
          profile,
        },
      });
    }
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_UNAUTHORIZED,
      message: errorResponses.AUTHENTICATION_ERROR,
    });
  } catch (err) {
    logger.error(err.message);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    let { email } = req.body;
    email = email.trim();
    const {
      success: getUserSuccess,
      errorCode: getUserErrorCode,
      message: getUserMessage,
      data: userData,
    } = await getUser({ where: { email } });
    if (!getUserSuccess) {
      return errorResponse({
        req,
        res,
        code: getUserErrorCode,
        message: getUserMessage,
      });
    }
    const {
      success,
      errorCode,
      message,
      data: resetUuid,
    } = await createPasswordResetEntry({ userData });
    if (!success) {
      return errorResponse({
        req,
        res,
        code: errorCode,
        message,
      });
    }
    await sendEmail({ email, resetUuid });
    return successResponse({
      res,
      message: successResponses.RESET_LINK_SENT,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err.message);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    let { new_password: password } = req.body;
    const {
      success: resetSuccess,
      errorCode: resetErrorCode,
      message: resetStatusMessage,
      data: resetData,
    } = await getResetData({ where: { uuid }, options: { raw: false } });
    if (!resetSuccess) {
      return errorResponse({
        req,
        res,
        code: resetErrorCode,
        message: resetStatusMessage,
      });
    }
    const { success, errorCode, message } = await checkResetValidity({
      resetData,
    });
    if (!success) {
      return errorResponse({
        req,
        res,
        code: errorCode,
        message: message,
      });
    }
    const {
      success: getUserSuccess,
      errorCode: getUserErrorCode,
      message: getUserMessage,
      data: userData,
    } = await getUser({
      where: { id: resetData.user_id },
      options: { raw: false },
    });
    if (!getUserSuccess) {
      return errorResponse({
        req,
        res,
        code: getUserErrorCode,
        message: getUserMessage,
      });
    }
    const {
      success: changePasswordSuccessStatus,
      errorCode: changePasswordCode,
      message: changePasswordMessage,
    } = await changeUserPassword({
      userData,
      password,
    });
    if (!changePasswordSuccessStatus) {
      return errorResponse({
        req,
        res,
        code: changePasswordCode,
        message: changePasswordMessage,
      });
    }
    userData.first_time_login = 0;
    await userData.save();
    resetData.status = 0;
    await resetData.save();
    return successResponse({
      res,
      message: successResponses.PASSWORD_CHANGED,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err.message);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
    });
  }
};

exports.getAccessTokenWithRefresh = async (req, res, next) => {
  try {
    const refreshToken = req.headers.authorization;
    const {
      success,
      errorCode,
      message,
      data: decodedToken,
    } = decodeRefreshToken({ refreshToken });
    if (!success) {
      return errorResponse({
        req,
        res,
        code: errorCode,
        message,
      });
    }
    const { id } = decodedToken;
    const idToken = generateTokens({
      payload: { id },
      expiresIn: expirationTime.ID_TOKEN,
      token_type: 'ID_TOKEN',
    });
    return successResponse({
      res,
      data: {
        idToken,
      },
      message: successResponses.TOKEN_REFRESHED,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
    });
  }
};
