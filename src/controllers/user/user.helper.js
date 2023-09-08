const {
  aergov_users,
  sequelize,
  aergov_user_roles,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { dbTables } = require('../../utils/constant');
const { logger } = require('../../utils/logger');
const { statusCodes } = require('../../utils/statusCode');
const {
  getDataById,
  getListUsersQuery,
  getUserRoleId,
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
        message: 'Invalid role_id',
        data: null,
      };
    }
    if (!user.user_type) user.user_type = 'USER';
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
      return {
        success: true,
        message: 'User added successfully',
        data: userData,
      };
    }
  } catch (err) {
    logger.error(err);
    transaction.rollback();
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: 'Error while creating user',
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
        message: 'Invalid user_id',
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
          message: 'Invalid role_id',
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
      if (data[0].id) {
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
        message: 'User data edited successfully',
        data: userData,
      };
    }
  } catch (err) {
    logger.error(err);
    transaction.rollback();
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: 'Error while modifying user',
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
      message: 'Data fetched sucessfully',
      data: data[0],
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: 'Error while fetching data',
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
        page_limit: parseInt(page_limit) || 10,
        page_number: parseInt(page_number) || 1,
        total_pages: totalPages !== 0 ? totalPages : 1,
      },
      message: 'User list fetched successfully',
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: 'Error while listing users',
      data: null,
    };
  }
};
