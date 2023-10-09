exports.successResponses = {
  ROLE_CREATED: 'Role created successfully',
  ROLES_FETCHED: `Roles fetched successfully`,
  PERMISSION_TREE_FETCHED: `Fetched master permission tree successfully`,
  MASTER_TREE_GENERATED: `Master tree is generated`,
  ROLE_UPDATED: `Role updated successfully`,
};

exports.errorResponses = {
  INVALID_STRING_OR_MISSING_ERROR: (value) => {
    return `${value} is mandatory`;
  },
  INVALID_OBJECT_OR_MISSING_ERROR: (value) => {
    return `${value} is mandatory`;
  },
  INTERNAL_ERROR: 'Something went wrong',
  NAME_EXISTS: 'Role already exists with this name, please try with new name',
  INVALID_FEATURES:
    'Features do not exist, please send a proper set of features',
  ROLE_CREATION_FAILED: 'Failed to create a role',
  PAGES_OR_FEATURES_NOT_FOUND: 'Pages or features not found',
  ROLE_NOT_FOUND: `Role not found`,
};
