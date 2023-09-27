const moment = require('moment');
const {
  aergov_users,
  aergov_reset_tokens,
  sequelize,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { hashPassword, verifyPassword } = require('../../utils/passwordHandler');
const { logger } = require('../../utils/logger');
const { statusCodes } = require('../../utils/statusCode');
const {
  successResponses,
  errorResponses,
  appType,
  userType,
} = require('./auth.constant');
const { queries } = require('./auth.query');
const jwt = require('jsonwebtoken');
const {
  constants,
} = require('../../services/aerpace-ecosystem-backend-db/src/commons/constant');

exports.decodeRefreshToken = async ({ refreshToken }) => {
  try {
    let decodedToken;
    try {
      decodedToken = jwt.verify(refreshToken, process.env.SECURITY_KEY);
    } catch (err) {
      return {
        success: false,
        code: statusCodes.STATUS_CODE_UNAUTHORIZED,
        message: errorResponses.TOKEN_INVALID,
        data: null,
      }
    }

    if (decodedToken.token_type !== 'REFRESH_TOKEN') {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_UNAUTHORIZED,
        message: errorResponses.INVALID_REFRESH_TOKEN,
        data: null,
      };
    }

    const userDataWithRoles = await sequelize.query(queries.userDataWithRole, {
      replacements: { id: decodedToken.user_id },
      type: sequelize.QueryTypes.SELECT,
    });

    return {
      success: true,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      data: userDataWithRoles[0],
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

exports.getValidUserWithRoleDetails = async ({ email, app }) => {
  try {
    const userRolesData = await sequelize.query(queries.getUser, {
      replacements: { email },
      type: sequelize.QueryTypes.SELECT,
    });
    if (
      userRolesData[0] &&
      app == appType.ADMIN_PORTAL &&
      userRolesData[0].user_type == userType.USER
    ) {
      return {
        success: true,
        message: successResponses.DATA_FETCH_SUCCESSFULL,
        data: userRolesData[0],
      };
    }
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_UNAUTHORIZED,
      message: errorResponses.INVALID_EMAIL_USERTYPE_COMBINATION,
      data: null,
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
        data: null,
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
        errorCode: statusCodes.STATUS_CODE_UNAUTHORIZED,
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

exports.changeTemporarayPassword = async ({ userId, password: enteredPassword }) => {
  try {
    const { success, errorCode, message, data: userData } = await this.getUser({ where: { id: userId }, options: { raw: false } })
    if (!success) {
      return {
        success,
        code: errorCode,
        message,
        data: null,
      };
    }
    const hashedPassword = await hashPassword({ password: enteredPassword });
    userData.password = hashedPassword;
    userData.first_time_login = 0;
    await userData.save();
    return {
      success: true,
      message: successResponses.PASSWORD_CHANGED,
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
}
