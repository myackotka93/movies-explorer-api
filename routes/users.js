const users = require('express').Router();
const { updateUserInfo, getUserInfo } = require('../controllers/users');
const { userInfoValidation } = require('../middlewares/validation');

users.get('/users/me', getUserInfo);
users.patch('/users/me', userInfoValidation, updateUserInfo);

module.exports = users;
