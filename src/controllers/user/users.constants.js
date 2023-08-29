exports.errorMessages = {
  INVAILD_STRING_OR_MISSING_ERROR: (value) => {
    return `${value} should be present and it must be an string`;
  },
  NO_ROLE_FOUND: 'No role found with this id',
  INVAILD_EMAIL_FORMAT_MESSAGE: 'Invalid email format',
  INVAILD_USER_ID_MESSAGE: 'Invalid user id',
  INVAILD_SEARCH_KEY: 'Invalid search key, it should be string!',
  PAGE_LIMIT_MESSAGE: 'Page limit should be positive',
  PAGE_NUMBER_MESSAGE: 'Page number should be positive',
  INVALID_USER_TYPE_MESSAGE: 'Invalid user type, it must be a string',
};

exports.successMessages = {
  USER_ADDED_MESSAGE: 'User created successfully',
  USER_UPDATED_MESSAGE: 'User updated successfully',
  USERS_FETCHED_MESSAGE: 'users fetched successfully',
};
