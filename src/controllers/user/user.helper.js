const {
  aergov_users,
  sequelize,
  aergov_user_roles,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { logger } = require('../../utils/logger');
const {
  getDataById,
  getListUsersQuery,
  getUserRoleId,
} = require('./user.query');

exports.addUserHelper = async (user) => {
  const transaction = await sequelize.transaction();
  try {
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
        data: userData,
      };
    }
  } catch (err) {
    logger.error(err);
    transaction.rollback();
    return {
      data: err,
      success: false,
    };
  }
};

exports.editUserHelper = async (user, id) => {
  const transaction = await sequelize.transaction();
  try {
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
        data: userData,
      };
    }
  } catch (err) {
    logger.error(err);
    transaction.rollback();
    return {
      data: err,
      success: false,
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
      data: data[0],
      success: true,
    };
  } catch (err) {
    logger.error(err);
    return {
      data: err,
      success: false,
    };
  }
};

exports.getUsersListHelper = async (search_key, pageLimit, pageNumber) => {
  try {
    const query = getListUsersQuery(search_key, pageLimit, pageNumber);
    const data = await sequelize.query(query);
    return {
      success: true,
      data: {
        users: data[0],
        pageLimit: parseInt(pageLimit) || 10,
        pageNumber: parseInt(pageNumber) || 1,
        totalPages: Math.round(
          parseInt(data[0][0]?.data_count || 0) / pageLimit,
        ),
      },
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      data: err,
    };
  }
};
