const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const { limiter } = require('./middlewares/rateLimit');
const errorHandler = require('./middlewares/processingErrors');

const { DATA_BASE, PORT } = require('./utils/configEnv');
const { corsOptions } = require('./utils/constants');

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DATA_BASE);

app.use(requestLogger);

app.use(limiter);
app.use('/', routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started, Port: ${PORT}`);
});
