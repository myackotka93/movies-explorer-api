const routes = require('express').Router();
const auth = require('../middlewares/auth');
const users = require('./users');
const movies = require('./movies');
const { signUp, signIn } = require('../controllers/auth');
const { signinValidation, signupValidation } = require('../middlewares/validation');
const { NOT_FOUND_ERROR } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');

routes.post('/signin', signinValidation, signIn);
routes.post('/signup', signupValidation, signUp);

routes.use(auth, users);
routes.use(auth, movies);

routes.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_ERROR));
});

module.exports = routes;
