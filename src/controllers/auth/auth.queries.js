const queries = {
  getUser: `SELECT *
  FROM aergov_users as au
  LEFT JOIN aergov_user_roles as aur ON aur.user_id = au.id
  LEFT JOIN aergov_roles as ar ON ar.id = aur.role_id
  WHERE email = :email
  `,
};

module.exports = {
  queries,
};
