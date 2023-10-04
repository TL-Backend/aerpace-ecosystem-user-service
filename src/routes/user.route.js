const {
  addUser,
  editUser,
  getUsersList,
  deleteUser,
} = require('../controllers/user/user.controller');
const {
  validateUserInput,
  validateUserUpdateInput,
  validateGetUsersInput,
} = require('../controllers/user/user.middleware');

module.exports = function (app) {
  app.post('/users', validateUserInput, addUser);
  app.patch('/users/:id', validateUserUpdateInput, editUser);
  app.get('/users', validateGetUsersInput, getUsersList);
  app.delete('/users/:id', deleteUser)
};
