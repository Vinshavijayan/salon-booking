var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
let MongoStore = require('connect-mongo')(session);

let db = require('./dbconfig/db-connect');


var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');


var app = express();


require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:'mysecret',
  resave:false,
  saveUninitialized:false,
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);


app.use(function (req,res,next) {
  res.locals.login=req.isAuthenticated();
  next();
});

app.use(function(req, res,next){
  res.locals.session = req.session;
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

db.connect(function (error) {

  if (error) {
    console.log('Unable to connect database');
    process.exit(1);
  } else {
    console.log(' Database connecetd successfully...');
  }

});

module.exports = app;
