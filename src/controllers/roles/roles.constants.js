exports.successResponses = {
  ROLE_CREATED: 'role created successfully',
};

exports.errorResponses = {
  INVAILD_STRING_OR_MISSING_ERROR: (value) => {
    return `${value} should be present and it must be an string`;
  },
  INVAILD_OBJECT_OR_MISSING_ERROR: (value) => {
    return `${value} should be present and it must be an object`;
  },
  INTERNAL_ERROR: 'Internal error',
  NAME_EXISTS: 'name already exists',
  INVALID_FEATURES:
    'features do not exists, please send proper set of features',
  ROLE_CREATION_FAILED: 'failed to create role',
  PAGES_OR_FEATURES_NOT_FOUND: 'pages or features are not found',
};
