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
} = require('./users.queries');

exports.addUserHelper = async (user) => {
  try {
    const params = {
      first_name: user.first_name,
      last_name: user.last_name || '',
      role_id: user.role_id,
      email: user.email,
      phone_number: user.phone_number,
      country_code: user.country_code,
      address: user.address,
      pin_code: user.pin_code,
      state: user.state,
      user_type: user.user_type || 'USER',
    };
    const userData = await aergov_users.create(params);
    await aergov_user_roles.create({
      user_id: userData.id,
      role_id: user.role_id,
    });
    if (userData) {
      return {
        success: true,
        data: userData,
      };
    }
  } catch (err) {
    logger.error(err);
    return {
      data: err,
      success: false,
    };
  }
};

exports.editUserHelper = async (user, id) => {
  try {
    const userData = await aergov_users.update(user, {
      where: { id },
      returning: true,
    });
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
        );
      } else {
        await aergov_user_roles.create({
          user_id: id,
          role_id: user.role_id,
        });
      }
    }
    if (userData) {
      return {
        success: true,
        data: userData,
      };
    }
  } catch (err) {
    logger.error(err);
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
    let limit = pageLimit || 10;
    const data = await sequelize.query(query);
    return {
      success: true,
      data: {
        users: data[0],
        pageLimit: parseInt(pageLimit) || 10,
        pageNumber: parseInt(pageNumber) || 1,
        totalPages: Math.round(parseInt(data[0][0]?.data_count || 0) / limit),
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
