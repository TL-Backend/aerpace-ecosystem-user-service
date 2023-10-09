const {
  listRoles,
  createRole,
  editRole,
} = require('../controllers/role/role.controller');

const {
  validateRoleInput,
  validateUpdateRoleInput,
} = require('../controllers/role/role.middleware');

module.exports = function (app) {
  app.get('/roles', listRoles);
  app.post('/roles', validateRoleInput, createRole);
  app.patch('/roles/:id', validateUpdateRoleInput, editRole);
};
