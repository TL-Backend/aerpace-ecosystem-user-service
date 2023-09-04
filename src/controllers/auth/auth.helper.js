const moment = require('moment');
const {
  aergov_users,
  aergov_reset_tokens,
  sequelize,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const {
  hashPassword,
  verifyPassword,
} = require('../../utils/password-handling.util');
const { logger } = require('../../utils/logger');
const { statusCodes } = require('../../utils/statusCodes');
const { successResponses, errorResponses } = require('./auth.constant');
const { queries } = require('./auth.querie');
const jwt = require('jsonwebtoken');

exports.decodeToken = ({ authorization }) => {
  try {
    const decodedToken = jwt.verify(
      JSON.parse(authorization),
      process.env.SECURITY_KEY,
    );
    if (decodedToken.token_type !== 'REFRESH_TOKEN') {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_UNAUTHORIZED,
        message: errorResponses.INVALID_REFRESH_TOKEN,
      };
    }
    const tokenExpiration = moment.unix(decodedToken.exp);
    if (moment().isAfter(tokenExpiration)) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_UNAUTHORIZED,
        message: errorResponses.TOKEN_EXPIRED,
      };
    }
    return {
      success: true,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      data: decodedToken,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
};

exports.getUserWithRoleDetails = async ({ email }) => {
  try {
    const userRolesData = await sequelize.query(queries.getUser, {
      replacements: { email },
      type: sequelize.QueryTypes.SELECT,
    });
    if (!userRolesData[0]) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
        message: errorResponses.EMAIL_INVALID,
        data: null,
      };
    }
    return {
      success: true,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      data: userRolesData[0],
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
};

exports.getUser = async ({ where, options = {}, attributes = {} }) => {
  try {
    const { raw = true } = options;
    const exclude = ['created_at', 'updated_at', 'createdAt', 'updatedAt'];
    const userData = raw
      ? await aergov_users.findOne({
          where,
          raw: true,
          attributes: { exclude },
        })
      : await aergov_users.findOne({ where, attributes: { exclude } });
    if (!userData) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
        message: errorResponses.USER_NOT_FOUND,
      };
    }
    return {
      success: true,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      data: userData,
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
};

exports.createPasswordResetEntry = async ({ userData }) => {
  try {
    const { id } = userData;
    const expiry = moment().add(24, 'hours');
    const data = await aergov_reset_tokens.create({
      user_id: id,
      status: 1,
      expiry,
    });
    const { uuid: reset_uuid } = data;
    return {
      success: true,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      data: reset_uuid,
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
};

exports.getResetData = async ({ where, options = {} }) => {
  try {
    const { raw = true } = options;
    const resetData = raw
      ? await aergov_reset_tokens.findOne({ where, raw: true })
      : await aergov_reset_tokens.findOne({ where });
    if (!resetData) {
      return {
        status: false,
        code: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
        message: errorResponses.UUID_INVALID,
      };
    }
    return {
      success: true,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      data: resetData,
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
};

exports.checkResetValidity = async ({ resetData: resetInfo }) => {
  try {
    const { status, expiry } = resetInfo;
    if (status == 0 || moment().isAfter(expiry)) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_UNAUTHORIZED,
        message: errorResponses.INVALID_RESET_LINK,
        data: false,
      };
    }
    return {
      success: true,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      data: true,
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
};

exports.changeUserPassword = async ({
  userData,
  password: enteredPassword,
}) => {
  try {
    const { password } = userData;
    const isPasswordUsed = await verifyPassword({ enteredPassword, password });
    if (isPasswordUsed) {
      return {
        success: false,
        code: statusCodes.STATUS_CODE_UNAUTHORIZED,
        message: errorResponses.SAME_PASSWORD_USED_ERROR,
        data: null,
      };
    }
    const hashedPassword = await hashPassword({ password: enteredPassword });
    userData.password = hashedPassword;
    await userData.save();
    return {
      success: true,
      data: null,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      code: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
};
