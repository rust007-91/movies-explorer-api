const rateLimit = require ('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Ограничить каждый IP-адрес до 100 запросов в окне (в течение 15 минут)
});

module.exports = limiter;