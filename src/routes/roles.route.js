const {
  listRoles,
  createRole,
} = require('../controllers/roles/roles.controller');

const { validateRoleInput } = require('../controllers/roles/roles.middlewares');

module.exports = function (app) {
  app.get('/roles', listRoles);
  app.post('/roles', validateRoleInput, createRole);
};
