const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {  // страна создания фильма
    type: String,
    required: [true, 'Поле "country" должно быть заполнено'],
  },
  director: { // режиссёр фильма
    type: String,
    required: [true, 'Поле "director" должно быть заполнено'],
  },
  duration: { // длительность фильма
    type: Number,
    required: [true, 'Поле "duration" должно быть заполнено'],
  },
  year: { // год выпуска фильма
    type: String,
    required: [true, 'Поле "year" должно быть заполнено'],
  },
  description: {  // описание фильма
    type: String,
    required: [true, 'Поле "description" должно быть заполнено'],
  },
  image: {  // ссылка на постер к фильму
    type: String,
    required: [true, 'Поле "image" должно быть заполнено'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный URL',
    },
  },
  trailerLink: {  // ссылка на трейлер фильма
    type: String,
    required: [true, 'Поле "trailerLink" должно быть заполнено'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный URL',
    },
  },
  thumbnail: {  // миниатюрное изображение постера к фильму
    type: String,
    required: [true, 'Поле "thumbnail" должно быть заполнено'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный URL',
    },
  },
  movieId: {  // id фильма, который содержится в ответе сервиса MoviesExplorer
    type: Number,
    required: [true, 'Поле "movieId" должно быть заполнено'],
  },
  nameRU: { //  название фильма на русском языке
    type: String,
    required: [true, 'Поле "nameRU" должно быть заполнено'],
  },
  nameEN: { //  название фильма на английском языке
    type: String,
    required: [true, 'Поле "nameEN" должно быть заполнено'],
  },
  owner: {  // _id пользователя, который сохранил фильм
    type: mongoose.Schema.Types.ObjectId, // для связи с моделью user за счёт айди создаваемое Mongo
    ref: 'user', // связь с моделью user
    required: [true, 'Поле "owner" должно быть заполнено'],
  },
},
  { versionKey: false },
);

const Movie = mongoose.model('movie', movieSchema);
module.exports = Movie;