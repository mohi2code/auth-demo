const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({
    message: 'Hi there..'
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  err = new Error(`Not Found - ${req.url}`);
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    type: err.name,
    status: err.status,
    stack: process.env.NODE_ENV == 'development' ? err.stack: undefined
  });
});

module.exports = app;
