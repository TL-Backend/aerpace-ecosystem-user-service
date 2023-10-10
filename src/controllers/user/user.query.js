const { dbTables } = require('../../utils/constant');
const {
  getPaginationQuery,
} = require('../../services/aerpace-ecosystem-backend-db/src/commons/common.query');
const { userType } = require('./user.constant');

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
  WHERE user_id = :user_id
  `;

exports.getListUsersQuery = ({ search_key, pageLimit, pageNumber, role, location }) => {
  let querySearchCondition = ``;
  let filterCondition = ``;
  let queryPagination = ` `;
  let roleFilterCondition = ``
  let locationFilterCondition = ``
  if (search_key) {
    querySearchCondition = `AND ( usr.first_name ILIKE '%${search_key}%' OR usr.last_name ILIKE '%${search_key}%' OR r.role_name ILIKE '%${search_key}%' OR usr.state ILIKE '%${search_key}%' OR usr.country_code ILIKE '%${search_key}%' OR usr.phone_number ILIKE '%${search_key}%' OR usr.email ILIKE '%${search_key}%' )`;
  }
  if (role) {
    roleFilterCondition = `AND r.role_name = ANY(ARRAY [:roleList])`
  }
  if (location) {
    locationFilterCondition = `AND usr.state = ANY(ARRAY [:locationList])`
  }
  filterCondition = ` ${roleFilterCondition} ${locationFilterCondition}`

  queryPagination = getPaginationQuery({ pageLimit, pageNumber });
  return `
  SELECT
    COUNT(*) OVER() AS data_count,
    usr.id AS id,
    usr.first_name, 
    usr.last_name, 
    usr.email, 
    usr.phone_number, 
    usr.country_code, 
    usr.address, 
    usr.pin_code, 
    usr.state,
    json_build_object('role_name', r.role_name, 'id', r.id) AS role
  FROM ${dbTables.USERS_TABLE} as usr
  LEFT JOIN ${dbTables.USER_ROLES_TABLE} as urole ON urole.user_id = usr.id
  LEFT JOIN ${dbTables.ROLES_TABLE} as r ON r.id = urole.role_id
  WHERE usr.user_type = '${userType.USER}' 
  ${querySearchCondition}
  ${filterCondition}
  GROUP BY 
    usr.id, 
    usr.first_name, 
    usr.last_name, 
    usr.email, 
    usr.phone_number, 
    usr.country_code, 
    usr.address, 
    usr.pin_code, 
    usr.state, 
    r.role_name, 
    r.id
  ORDER BY usr.created_at DESC
  ${queryPagination};
`;
};

exports.getRoleFilterQuery = `
SELECT
JSON_BUILD_OBJECT(
  'roles', JSON_AGG(DISTINCT role_name),
  'locations', JSON_AGG(DISTINCT state)
) AS result
FROM aergov_roles AS ar,  aergov_users As au;
`