const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // импортируем модуль jsonwebtoken
const {JWT_SECRET} = require('../config');
const User = require('../models/user');
const statusCode = require('../utils/constants');
const NotFoundError = require ('../Class-errors/NotFoundError');
const BadRequestError = require ('../Class-errors/BadRequestError');
const Unauthorized = require ('../Class-errors/Unauthorized');

// создаёт пользователя для регистрации
const createUser = (req, res, next) => {
 const { email, password, name } = req.body;

 if(!email || !password) {
   next(new BadRequestError({ message: 'email или пароль не могут быть пустыми' }));
 } else {
   bcrypt.hash(String(password), 10) // хеширование пароля
     .then((hash) => User.create({ email, password: hash, name }))
     .then((user) => res.status(statusCode.CREATED).send(user))
     .catch(next);
 }
};

// проверяет переданные в теле почту и пароль и возвращает JWT
const login = (req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password) {
    next(new BadRequestError({ message: 'email или пароль не могут быть пустыми' }));
  } else {
    User.findOne({ email })
      .select('+password')  // select('+password') отменяем правило исключения в модели
      .orFail(() => new BadRequestError({ message: 'Переданы некорректные данные' }))
      // сравниваем переданный пароль и хеш из базы
      .then((user) => bcrypt.compare(String(password), user.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }); // создать JWT, токен будет просрочен через 7 дней
            res.status(statusCode.OK).send({token});
          } else {
            next(new Unauthorized({ message: 'Неправильные почта или пароль' }));
          }
        })
        .catch(next))
  .catch(next);
  }
};

// возвращает информацию о пользователе (email и имя)
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError({ message: 'Пользователь не найден' })) // прерываем если такого пользователя нет
    .then((user) => res.status(statusCode.OK).send(user)) // отправляем данные пользователя если нет ошибок
    .catch(next); // если есть ошибки проваливемся в децентрализованный обработчик
};

// обновляет информацию о пользователе (email и имя)
const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    userId,
    { email, name },
    // опция для обновления до того как данные попадут в then
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    })
    .orFail(() => new NotFoundError({ message: 'Пользователь не найден' }))
    .then((user) => res.status(statusCode.OK).send(user))
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUser,
  updateUser,
};