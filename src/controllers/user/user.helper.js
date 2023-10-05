const {
  aergov_users,
  sequelize,
  aergov_user_roles,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { dbTables } = require('../../utils/constant');
const { sendTemporaryPasswordEmail } = require('../../utils/emailSender');
const { logger } = require('../../utils/logger');
const {
  generateTemporaryPassword,
  hashPassword,
} = require('../../utils/passwordHandler');
const { statusCodes } = require('../../utils/statusCode');
const messages = require('./user.constant');
const {
  getDataById,
  getListUsersQuery,
  getUserRoleId,
  getUserByEmailQuery,
} = require('./user.query');

exports.addUserHelper = async (user) => {
  const transaction = await sequelize.transaction();
  try {
    const roleExist = await this.validateDataInDBById(
      user.role_id,
      dbTables.ROLES_TABLE,
    );
    if (!roleExist.data || !roleExist.success) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: messages.errorMessages.INVALID_ROLE_ID,
        data: null,
      };
    }
    if (!user.user_type) user.user_type = 'USER';
    const userExist = await this.checkUserExistWithEmail(
      user.email,
      user.user_type,
    );
    if (userExist.data || !userExist.success) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: messages.errorMessages.USER_ALREADY_EXIST_WITH_EMAIL,
        data: null,
      };
    }
    user.first_time_login = 1;
    const temporaryPassword = await generateTemporaryPassword();
    const hashedPassword = await hashPassword({ password: temporaryPassword });
    user.password = hashedPassword;
    const userData = await aergov_users.create(user, { transaction });
    if (userData) {
      await aergov_user_roles.create(
        {
          user_id: userData.id,
          role_id: user.role_id,
        },
        { transaction },
      );
      transaction.commit();
      await sendTemporaryPasswordEmail({
        email: userData.email,
        temporaryPassword,
      });
      user.id = userData.id;
      delete user.password;
      delete user.first_time_login;
      return {
        success: true,
        message: messages.successMessages.USER_ADDED_MESSAGE,
        data: user,
      };
    }
  } catch (err) {
    logger.error(err.message);
    transaction.rollback();
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: messages.errorMessages.CREATE_USER_ERROR_FOUND,
      data: null,
    };
  }
};

exports.editUserHelper = async (user, id) => {
  const transaction = await sequelize.transaction();
  try {
    const userExist = await this.validateDataInDBById(id, dbTables.USERS_TABLE);
    if (!userExist.data || !userExist.success) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: messages.errorMessages.INVALID_USER_ID_MESSAGE,
        data: null,
      };
    }
    if (user.role_id) {
      const roleExist = await this.validateDataInDBById(
        user.role_id,
        dbTables.ROLES_TABLE,
      );
      if (!roleExist.data || !roleExist.success) {
        return {
          success: false,
          errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
          message: messages.errorMessages.INVALID_ROLE_ID,
          data: null,
        };
      }
    }
    const userData = await aergov_users.update(
      user,
      {
        where: { id },
        returning: true,
      },
      { transaction },
    );
    if (user.role_id) {
      const query = getUserRoleId;
      const data = await sequelize.query(query, {
        replacements: { user_id: id, role_id: user.role_id },
        type: sequelize.QueryTypes.SELECT,
      });
      if (data[0]?.id) {
        await aergov_users.update(
          {
            user_id: id,
            role_id: user.role_id,
          },
          {
            where: { id: data.id },
            returning: true,
          },
          { transaction },
        );
      } else {
        await aergov_user_roles.create(
          {
            user_id: id,
            role_id: user.role_id,
          },
          { transaction },
        );
      }
    }
    if (userData) {
      transaction.commit();
      return {
        success: true,
        message: messages.successMessages.USER_UPDATED_MESSAGE,
        data: userData,
      };
    }
  } catch (err) {
    logger.error(err.message);
    transaction.rollback();
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: messages.errorMessages.UPDATE_USER_ERROR_FOUND,
      data: null,
    };
  }
};

exports.checkUserExistWithEmail = async (email, user_type) => {
  try {
    const query = getUserByEmailQuery;
    const data = await sequelize.query(query, {
      replacements: { email, user_type },
      type: sequelize.QueryTypes.SELECT,
    });
    return {
      success: true,
      message: messages.successMessages.USERS_FETCHED_MESSAGE,
      data: data[0],
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: messages.errorMessages.FETCHING_USERS_ERROR_FOUND,
      data: null,
    };
  }
};

exports.validateDataInDBById = async (id_key, table) => {
  try {
    const query = getDataById(table);
    const data = await sequelize.query(query, {
      replacements: { id_key },
      type: sequelize.QueryTypes.SELECT,
    });
    return {
      success: true,
      message: messages.successMessages.DATA_FETCHED_MESSAGE,
      data: data[0],
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: messages.errorMessages.FETCHING_USERS_ERROR_FOUND,
      data: null,
    };
  }
};

exports.getUsersListHelper = async (search_key, page_limit, page_number) => {
  try {
    const query = getListUsersQuery(search_key, page_limit, page_number);
    const data = await sequelize.query(query);
    let totalPages = Math.round(
      parseInt(data[0][0]?.data_count || 0) / parseInt(page_limit || 10),
    );
    return {
      success: true,
      data: {
        users: data[0],
        total_count: parseInt(data[0][0]?.data_count) || 0,
        page_limit: parseInt(page_limit) || 10,
        page_number: parseInt(page_number) || 1,
        total_pages: totalPages !== 0 ? totalPages : 1,
      },
      message: messages.successMessages.USERS_FETCHED_MESSAGE,
    };
  } catch (err) {
    logger.error(err.message);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: messages.errorMessages.FETCHING_USERS_ERROR_FOUND,
      data: null,
    };
  }
};

exports.hardDeleteUserHelper = async ({ id }) => {
  try {
    const userData = await aergov_users.findOne({
      where: {
        id,
      },
    });
    if (!userData) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
        message: messages.errorMessages.USER_NOT_FOUND,
        data: null,
      };
    }
    await aergov_users.destroy({
      where: {
        id: userData.id,
      },
    });
    return {
      success: true,
      errorCode: statusCodes.STATUS_CODE_SUCCESS,
      message: messages.successMessages.USER_DELETED_MESSAGE,
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
