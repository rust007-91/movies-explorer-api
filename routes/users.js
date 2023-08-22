const router = require('express').Router();

const {
  getUser,
  updateUser,
} = require('../controllers/users');

// валидация JOI
const {
  userUpdateValidate,
} = require('../middlewares/validation');

router.get('/me', getUser); // возвращает информацию о пользователе (email и имя)

router.patch('/me', userUpdateValidate, updateUser); // обновляет информацию о пользователе (email и имя)

module.exports = router;