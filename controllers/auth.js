const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const AuthorizedError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.signUp = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  if (!email || !password || !name) {
    throw new NotFoundError('Отсутсвуют обязательные данные');
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res
      .status(200)
      .send({
        _id: user._id,
        email: user.email,
        name: user.name,
      }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Пароль или почта некорректны'));
      }
      next(err);
    });
};

module.exports.signIn = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Введенны некорректные данные');
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret', { expiresIn: '7d' });
      const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      res
        .status(200)
        .send({ data, token });
    })
    .catch((err) => {
      if (err.name === 'Error') next(new AuthorizedError(err.message));
      next(err);
    });
};
