var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorHandler = require('error-handler');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

if(app.get('env') === 'development'){
app.locals.pretty = true;
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('my v3ry s3cr3t C00k1e k3y d0nt y0u th1nk?'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);

var dbHost = process.env.DB_HOST || 'localhost';
var dbPort = process.env.DB_PORT || 27017;
var dbName = process.env.DB_NAME || 'beps';

var dbURL = 'mongoodb://'+dbHost+':'+dbPort+'/'+dbName;
if(app.get('env') == 'live') {
  //prepend url with authentication credentials //
       dbURL = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+dbHost+':'+dbPort+'/'+dbName;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
