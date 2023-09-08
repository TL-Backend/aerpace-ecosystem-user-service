const { dbTables } = require('../../utils/constant');

exports.listRolesQuery = (params) => {
  let querySearchCondition = '';
  if (params.search) {
    querySearchCondition = `WHERE role_name ILIKE '%${params.search}%'`;
  }

  const query = `
  SELECT *
  FROM ${dbTables.ROLES_TABLE}
  ${querySearchCondition}
  `;
  return query;
};

exports.listMasterRolesQuery = `
  SELECT
  (
    SELECT json_agg(json_build_object(
      'id', id,
      'name', name,
      'parent_id', parent_id,
      'identifier', identifier
    ))
    FROM ${dbTables.PAGES_TABLE}
  ) AS pages,
  (
    SELECT json_agg(json_build_object(
      'id', id,
      'name', name,
      'identifier', identifier,
      'page_id', page_id
    ))
    FROM ${dbTables.FEATURES_TABLE}
  ) AS features;
`;

exports.getFeaturesByIdentifiersQuery = `
  WITH identifiers_to_check AS (
    SELECT unnest(ARRAY [:permissions]) AS identifier
  )
  SELECT CASE
           WHEN COUNT(DISTINCT af.identifier) = (SELECT COUNT(*) FROM identifiers_to_check) THEN true
           ELSE false
       END AS result
  FROM identifiers_to_check itc
       LEFT JOIN ${dbTables.FEATURES_TABLE} af ON itc.identifier = af.identifier;
`;
