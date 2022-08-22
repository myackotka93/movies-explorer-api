const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  INVALID_REQUEST_ERROR, NOT_FOUND_MOVIE, FORBIDDEN_ERROR,
} = require('../utils/constants');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(INVALID_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NOT_FOUND_MOVIE);
      } if (req.user._id !== movie.owner._id.toString()) {
        throw new ForbiddenError(FORBIDDEN_ERROR);
      }
      Movie.findByIdAndDelete(req.params.movieId)
        .then(() => res.send(movie))
        .catch((err) => {
          if (err.name === 'CastError' || err.name === 'ValidationError') {
            next(new BadRequestError(INVALID_REQUEST_ERROR));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(INVALID_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
};

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};
