exports.dbTables = {
  ROLES_TABLE: 'aergov_roles',
  PAGES_TABLE: 'aergov_portal_pages',
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

exports.levelStarting = {
  distribution: 'dr_',
};


exports.successResponses = {
  TOKEN_DATA_FETCHED: `Token data fetched successfully`,
  HEALTH_CHECK_SUCCESS: `Health check passed`,
};

exports.errorResponses = {
  SOMETHING_WENT_WRONG: `Something went wrong`,
  ACCESS_DENIED: `Access denied`,
  INVALID_CSV_FILE: `Invalid csv file`,
};

exports.methods = {
  POST: `POST`,
  GET: `GET`,
  PATCH: `PATCH`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};