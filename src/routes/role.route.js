const {
  listRoles,
  createRole,
} = require('../controllers/role/role.controller');

const { validateRoleInput } = require('../controllers/role/role.middleware');

module.exports = function (app) {
  app.get('/roles', listRoles);
  app.post('/roles', validateRoleInput, createRole);
};
