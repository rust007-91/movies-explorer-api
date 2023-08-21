require('dotenv').config();

const {
  DB_URL,
  JWT_SECRET,
  NODE_ENV } = process.env;

module.exports = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  DB_URL: NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/bitfilmsdb'
};
