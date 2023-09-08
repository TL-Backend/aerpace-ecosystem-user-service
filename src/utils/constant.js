exports.dbTables = {
  ROLES_TABLE: 'aergov_roles',
  USERS_TABLE: 'aergov_users',
  USER_ROLES_TABLE: 'aergov_user_roles',
  FEATURES_TABLE: 'aergov_page_features',
};

exports.redisKeys = {
  MASTER_ROLES_TREE: `masterRolesTree`,
};

exports.expirationTime = {
  ID_TOKEN: '4h',
  REFRESH_TOKEN: '30d',
};
