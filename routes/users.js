const users = require('express').Router();
const { updateUserInfo, getUserInfo } = require('../controllers/users');

users.get('/me', getUserInfo);
users.patch('users/me', updateUserInfo);

module.exports = users;
