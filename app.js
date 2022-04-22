const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes');

require('dotenv').config();

const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(routes);

app.use(requestLogger);



app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Что-то пошло не так' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`server started, Port: ${PORT}`);
});