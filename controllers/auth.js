const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const AuthorizedError = require('../errors/auth-err');

const {
  INVALID_REQUEST_ERROR,
  MONGO_ERROR,
  UNAUTHORIZED_ERROR,
} = require('../utils/constants');

const {
  JWT_SECRET
} = require('../utils/configEnv');

module.exports.signUp = (req, res, next) => {
  const {
    name,
    email,
    password
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash
    }))
    .then((user) => {      
      const token = jwt.sign({
        _id: user._id
      }, JWT_SECRET, {
        expiresIn: '7d'
      });
      const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      res.send({
        data,
        token
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        next(new ConflictError(MONGO_ERROR));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(INVALID_REQUEST_ERROR));
      }
      next(err);
    });
};

module.exports.signIn = (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError(INVALID_REQUEST_ERROR);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({
        _id: user._id
      }, JWT_SECRET, {
        expiresIn: '7d'
      });
      const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      res.send({
        data,
        token
      });
    })
    .catch((err) => {
      if (err.name === 'Error') next(new AuthorizedError(UNAUTHORIZED_ERROR));
      next(err);
    });
};

module.exports.signOut = (req, res, next) => {
  payload = jwt.verify(token, JWT_SECRET);
}