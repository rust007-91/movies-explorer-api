const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const {
  createUser,
  login
} = require('../controllers/users');

// валидация JOI
const { authValidate, loginValidate } = require('../middlewares/validation');
const NotFoundError = require('../Class-errors/NotFoundError');

router.post('/signup', createUser, authValidate); // создаёт и регистрирует пользователя
router.post('/signin', login, loginValidate); // проверяет переданные в теле почту и пароль и возвращает JWT

router.use(auth); // авторизация для запросов ниже

router.use('/users', userRouter); // роуты на пользователя
router.use('/movies', movieRouter); // роуты на фильмы

router.use((req, res, next) => {
  next(new NotFoundError({ message: 'Страница не существует' }));
});

module.exports = router;