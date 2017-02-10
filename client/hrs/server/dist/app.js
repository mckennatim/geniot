'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var blank = require('./modules/blank/routes');
var verifyAddr = require('./modules/verify-addr/routes');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*-----------------------------setup to allow for cross domain use-----------------------------------*/
app.all('*', function (req, res, next) {
  var htt = req.headers.origin;
  res.header("Access-Control-Allow-Origin", htt);
  //res.header("Access-Control-Allow-Origin", 'all');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-xsrf-token, Authorization");
  next();
});

app.get('/', function (req, res) {
  res.send('at the root of nothing');
});

app.get('/api', function (req, res) {
  res.send('at the api');
});
app.use('/api', blank);

app.get('/api/hrs', function (req, res) {
  res.send('at the api/hrs');
});
app.use('/api/hrs', verifyAddr);

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}
module.exports = app;