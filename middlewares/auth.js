const jwt = require('jsonwebtoken');
const AuthorizedError = require('../errors/auth-err');
const { JWT_SECRET } = require('../utils/configEnv');
const { AUTHORIZATION_ERROR } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizedError(AUTHORIZATION_ERROR);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthorizedError(AUTHORIZATION_ERROR));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
