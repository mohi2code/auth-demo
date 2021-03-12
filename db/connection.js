const db = require('monk')(process.env.DB_URI);
module.exports = db;