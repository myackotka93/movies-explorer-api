const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const {
  INVALID_REQUEST_ERROR,
  MONGO_ERROR,
  NOT_FOUND_USER,
} = require('../utils/constants');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_USER);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(INVALID_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  if (!name || !about) {
    throw new BadRequestError(INVALID_REQUEST_ERROR);
  }

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_USER);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(INVALID_REQUEST_ERROR));
      } else if (err.name === 'MongoError') {
        next(new NotFoundError(MONGO_ERROR));
      } else {
        next(err);
      }
    });
};
