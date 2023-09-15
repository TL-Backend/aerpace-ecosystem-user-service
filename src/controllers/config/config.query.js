exports.getRolePermissions = `
  SELECT *
  FROM aergov_user_roles AS aur
    LEFT JOIN aergov_roles AS ar ON ar.id = aur.role_id
  WHERE user_id = :userId
`;
