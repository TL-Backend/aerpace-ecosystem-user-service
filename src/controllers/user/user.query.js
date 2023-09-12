const { dbTables } = require('../../utils/constant');
const {
  getPaginationQuery,
} = require('../../services/aerpace-ecosystem-backend-db/src/commons/common.query');

exports.getDataById = (table) => {
  return `SELECT *
  FROM ${table}
  WHERE id = :id_key
  `;
};

exports.getUserByEmailQuery = `SELECT *
  FROM ${dbTables.USERS_TABLE}
  WHERE email = :email AND user_type = :user_type
  `;

exports.getUserRoleId = `SELECT id
  FROM ${dbTables.USER_ROLES_TABLE}
  WHERE user_id = :user_id AND role_id = :role_id
  `;

exports.getListUsersQuery = (search_key, pageLimit, pageNumber) => {
  let querySearchCondition = ``;
  let queryPagination = ' ';
  if (search_key) {
    querySearchCondition = `WHERE usr.first_name ILIKE '%${search_key}%' OR usr.last_name ILIKE '%${search_key}%'`;
  }
  queryPagination = getPaginationQuery({ pageLimit, pageNumber });
  return `SELECT
  COUNT(*) OVER() AS data_count,
  usr.id AS user_id,
  usr.first_name, usr.last_name, usr.email, usr.phone_number, usr.country_code, usr.address, usr.pin_code, usr.state,
  json_agg(json_build_object('role_name', r.role_name, 'roles', r.id)) AS roles
  FROM ${dbTables.USERS_TABLE} as usr
  LEFT JOIN ${dbTables.USER_ROLES_TABLE} as urole ON urole.user_id = usr.id
  LEFT JOIN ${dbTables.ROLES_TABLE} as r ON r.id = urole.role_id
  ${querySearchCondition}
  GROUP BY usr.id, usr.first_name, usr.last_name, usr.email, usr.phone_number, usr.country_code, usr.address, usr.pin_code, usr.state
  ${queryPagination};
`;
};
