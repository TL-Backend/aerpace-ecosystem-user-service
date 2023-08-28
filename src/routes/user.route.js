const {
  addUser,
  editUser,
  getUsersList,
} = require('../controllers/user/users.controller');
const {
  validateUserInput,
  validateUserUpdateInput,
  validateGetUsersInput,
} = require('../controllers/user/users.middleware');

module.exports = function (app) {
  app.post('/user', validateUserInput, addUser);
  app.patch('/user/:id', validateUserUpdateInput, editUser);
  app.get('/users', validateGetUsersInput, getUsersList);
};
