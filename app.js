const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { DB_URL } = require('./config');
const errorHandler = require('./middlewares/errors');
const index = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimit');

const {PORT = 3001} = process.env; // слушаем порт
const app = express(); // приложение (точка входа)
app.use(cors());
mongoose.connect(DB_URL); // связь между сервером и базой

// краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger); // подключаем логгер запросов
app.use(limiter); // ограничение запросов
app.use(helmet()); // защита от веб уязвимостей
app.use(bodyParser.json()); // объединяем все пакеты JSON-формата
app.use(index); // роутинг
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorHandler); // децентрализованная мидэлвара обработки ошибок

app.listen(PORT, () => console.log('Сервер запущен')); // слушаем порт