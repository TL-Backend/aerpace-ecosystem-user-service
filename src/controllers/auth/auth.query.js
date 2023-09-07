const { dbTables } = require('../../utils/constant');

const queries = {
  getUser: `SELECT *
  FROM ${dbTables.USERS_TABLE} as au
  LEFT JOIN ${dbTables.USER_ROLES_TABLE} as aur ON aur.user_id = au.id
  LEFT JOIN ${dbTables.ROLES_TABLE} as ar ON ar.id = aur.role_id
  WHERE email = :email
  `,
  userDataWithRole: `SELECT *
  FROM ${dbTables.USERS_TABLE} as au
  LEFT JOIN ${dbTables.USER_ROLES_TABLE} as aur ON aur.user_id = au.id
  LEFT JOIN ${dbTables.ROLES_TABLE} as ar ON ar.id = aur.role_id
  WHERE au.id = :id
  `,
};

module.exports = {
  queries,
};
