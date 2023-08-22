const router = require('express').Router();

const {
  getMovies,
  createMovies,
  deleteMovies,
} = require('../controllers/movies');

// валидация JOI
const {
  createMovieValidate,
  idValidate
} = require('../middlewares/validation');

router.get('/', getMovies); // возвращает все сохранённые текущим пользователем фильмы

router.post('/', createMovieValidate, createMovies); // создаёт фильм с переданными в теле параметрами

router.delete('/:_id', idValidate, deleteMovies); // удаляет сохранённый фильм по id

module.exports = router;