const {
  aergov_users,
  sequelize,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { logger } = require('../../utils/logger');
const { getDataById, getListUsersQuery } = require('./users.queries');

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
    const userData = await aergov_users.create(params).catch((err) => {
      logger.error(err);
      return {
        success: false,
        data: err,
      };
    });
    if (!userData.success) {
      return {
        success: true,
        data: userData,
      };
    }
    throw userData.data;
  } catch (err) {
    return {
      data: err,
      success: false,
    };
  }
};

exports.editUserHelper = async (user, id) => {
  try {
    const userData = await aergov_users
      .update(user, {
        where: { id },
        returning: true,
      })
      .catch((err) => {
        logger.error(err);
        return {
          success: false,
          data: err,
        };
      });
    if (!userData.success) {
      return {
        success: true,
        data: userData,
      };
    }
    throw userData.data;
  } catch (err) {
    return {
      data: err,
      success: false,
    };
  }
};

exports.validateDataInDBById = async (id_key, table) => {
  try {
    const query = getDataById(table);
    const data = await sequelize
      .query(query, {
        replacements: { id_key },
        type: sequelize.QueryTypes.SELECT,
      })
      .then((data) => {
        return data[0];
      })
      .catch((err) => {
        return undefined;
      });
    if (!data) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

exports.getUsersListHelper = async (search_key, pageLimit, pageNumber) => {
  try {
    const query = getListUsersQuery(search_key, pageLimit, pageNumber);
    let limit = pageLimit || 10;
    const data = await sequelize
      .query(query)
      .then((data) => {
        return {
          data: {
            users: data[0] || [],
            pageLimit: pageLimit || 10,
            pageNumber: pageNumber || 1,
            totalPages: Math.round(
              parseInt(data[0][0]?.data_count || 0) / limit,
            ),
          },
        };
      })
      .catch((err) => {
        return {
          error: true,
          message: err,
        };
      });
    if (data.error) {
      return {
        success: false,
        data: data.message,
      };
    }
    return {
      success: true,
      data: data,
    };
  } catch (err) {
    return {
      success: false,
      data: err,
    };
  }
};
