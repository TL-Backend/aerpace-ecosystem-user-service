const moment = require('moment');
const {
  aergov_users,
  aergov_reset_tokens,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const {
  hashPassword,
  verifyPassword,
} = require('../../utils/password-handling.util');
const { logger } = require('../../utils/logger');

exports.getUser = async (where, options = {}, attributes = {}) => {
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
    return {
      success: true,
      data: userData,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      code: statusCodes.STATUS_CODE_FAILURE,
      message: '',
    };
  }
};

exports.createPasswordResetEntry = async (userData) => {
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
      data: reset_uuid,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      code: statusCodes.STATUS_CODE_FAILURE,
      message: '',
    };
  }
};

exports.getResetData = async (where, options = {}) => {
  try {
    const { raw = true } = options;
    const resetData = raw
      ? await aergov_reset_tokens.findOne({ where, raw: true })
      : await aergov_reset_tokens.findOne({ where });
    return {
      success: true,
      data: resetData,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      code: statusCodes.STATUS_CODE_FAILURE,
      message: '',
    };
  }
};

exports.checkResetValidity = async (resetInfo) => {
  const { status, expiry } = resetInfo;
  if (status == 0 || moment().isAfter(expiry)) {
    return false;
  }
  return {
    success: true,
    data: true,
  };
};

exports.changeUserPassword = async (userData, new_password) => {
  try {
    let isPasswordUpdated = true;
    const { password } = userData;
    const isPasswordUsed = await verifyPassword(new_password, password);
    if (isPasswordUsed) {
      isPasswordUpdated = false;
    }
    const hashedPassword = await hashPassword(new_password);
    userData.password = hashedPassword;
    await userData.save();
    return {
      success: true,
      data: isPasswordUpdated,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      code: statusCodes.STATUS_CODE_FAILURE,
      message: '',
    };
  }
};
