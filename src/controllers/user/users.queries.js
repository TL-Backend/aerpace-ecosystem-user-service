const { dbTables } = require('../../utils/constants');

exports.getDataById = (table) => {
  const query = `SELECT *
  FROM ${table}
  WHERE id = :id_key
  `;
  return query;
};

exports.getListUsersQuery = (search_key, pageLimit, pageNumber) => {
  let querySearchCondition = ``;
  let queryPagination = ' ';
  if (search_key) {
    querySearchCondition = `WHERE first_name ILIKE '%${search_key}%' OR last_name ILIKE '%${search_key}%'`;
  }
  if (pageNumber || pageLimit) {
    queryPagination = `OFFSET((${parseInt(
      pageNumber ? pageNumber : 1,
    )}-1)*${parseInt(pageLimit ? pageLimit : 10)})
           ROWS FETCH NEXT ${parseInt(pageLimit ? pageLimit : 10)} ROWS ONLY`;
  }
  const query = `select
    COUNT(*) OVER() AS data_count,
    *
    FROM ${dbTables.USERS_TABLE}
    ${querySearchCondition}
    ${queryPagination}
    `;
  return query;
};
