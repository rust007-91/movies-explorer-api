const statusCode = require('../utils/constants');

const BadRequestError = require('../Class-errors/BadRequestError');
const NotFoundError = require('../Class-errors/NotFoundError');
const Unauthorized = require('../Class-errors/Unauthorized');
const ConflictServerError = require('../Class-errors/ConflictServerError');
const InternalServerError = require('../Class-errors/InternalServerError');
const Forbidden = require('../Class-errors/Forbidden');

const errorHandler = (err, req, res, next) => {
  let error;

  if (err.name === 'CastError' || err.name === 'ValidationError' || err.statusCode === statusCode.BAD_REQUEST) {
    error = new BadRequestError(err);
  } else if (err.statusCode === statusCode.UNAUTHORIZED) {
    error = new Unauthorized(err);
  } else if (err.statusCode === statusCode.NOT_FOUND) {
    error = new NotFoundError(err);
  } else if (err.statusCode === statusCode.FORBIDDEN) {
    error = new Forbidden(err);
  } else if (err.code === 11000) {
    error = new ConflictServerError(err);
  } else {
    error = new InternalServerError(err);
  }

  res.status(error.statusCode).send({ message: error.message });

  next();
};

module.exports = errorHandler;