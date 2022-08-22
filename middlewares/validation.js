const { celebrate, Joi } = require('celebrate');
const { urlValidation } = require('../errors/error-celebrate');

module.exports.signupValidation = celebrate({
  body: Joi
    .object()
    .keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
});

module.exports.signinValidation = celebrate({
  body: Joi
    .object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
});

module.exports.userInfoValidation = celebrate({
  body: Joi
    .object()
    .keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
});

module.exports.movieIdValidation = celebrate({
  params: Joi
    .object()
    .keys({
      movieId: Joi.string().length(24).hex(),
    }),
});

module.exports.movieValidation = celebrate({
  body: Joi
    .object()
    .keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      owner: Joi.string().length(24),
      image: Joi.string().required().custom(urlValidation),
      trailer: Joi.string().required().custom(urlValidation),
      thumbnail: Joi.string().required().custom(urlValidation),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
});
