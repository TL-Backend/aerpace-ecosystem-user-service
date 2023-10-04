const { dbTables } = require('../../utils/constant');

exports.getRolePermissions = `
  SELECT *
  FROM ${dbTables.USER_ROLES_TABLE} AS aur
    LEFT JOIN ${dbTables.ROLES_TABLE} AS ar ON ar.id = aur.role_id
  WHERE user_id = :userId
`;
