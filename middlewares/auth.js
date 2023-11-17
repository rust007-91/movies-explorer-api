const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const Unauthorized = require('../Class-errors/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;   // достаём авторизованный заголовок

  // убеждаемся, что он есть или начинается с Bearer
  if(!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized({ message: 'Необходима авторизация' }));
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      next(new Unauthorized({ message: 'Необходима авторизация' }));
    }
    req.user = payload;
  }
  next();
};

module.exports = auth;