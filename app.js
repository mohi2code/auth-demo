const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const api = require('./api');
const errorHandler = require('./errorHandler');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({
    message: 'Hi there..'
  });
});

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  err = new Error(`Not Found - ${req.url}`);
  err.status = 404;
  next(err);
});

// error handler
app.use(errorHandler, function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    name: err.name,
    status: err.status,
    stack: process.env.NODE_ENV == 'development' ? err.stack: undefined
  });
});

module.exports = app;
