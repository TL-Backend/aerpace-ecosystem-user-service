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
  if (Boolean(search_key)) {
    querySearchCondition = `WHERE first_name ILIKE '%${search_key}%' OR last_name ILIKE '%${search_key}%'`;
  }
  if (Boolean(pageNumber) || Boolean(pageLimit)) {
    let page = pageNumber ? pageNumber : 1;
    let pagesize = pageLimit ? pageLimit : 10;
    queryPagination = `OFFSET((${parseInt(page)}-1)*${parseInt(pagesize)})
           ROWS FETCH NEXT ${parseInt(pagesize)} ROWS ONLY`;
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
