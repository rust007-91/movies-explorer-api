const Movie = require('../models/movie');
const statusCode = require('../utils/constants');
const NotFoundError = require ('../Class-errors/NotFoundError');
const Forbidden = require ('../Class-errors/Forbidden');

// возвращает все сохранённые текущим пользователем фильмы
const getMovies = (req, res, next) => {
  Movie.find({owner: req.user._id})
    .then((savedFilms) => res.status(statusCode.OK).send(savedFilms))
    .catch(next);
}

// создаёт фильм с переданными в теле параметрами
const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id, // расширение объекта
    })
    .then((movie) => res.status(statusCode.CREATED).send(movie))
    .catch(next);
}

// удаляет сохранённый фильм по id
const deleteMovies = (req, res, next) => {
  const filmId = req.params;
  Movie.findById(filmId)
    .orFail(() => new NotFoundError({ message: 'Фильм с указанным _id не найден.' }))
    .then((film) => {
      if (film.owner.toString() !== req.user._id) {
        next(new Forbidden({ message: 'Невозможно удалить чужой фильм' }));
      } else {
        Movie.deleteOne(filmId)
          .then(() => res.send(film))
          .catch(next)
      }
    })
    .catch(next);
}


module.exports = {
  getMovies,
  createMovies,
  deleteMovies,
};