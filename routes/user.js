var express = require('express');
var router = express.Router();
let csrf = require('csurf');
let bcrypt = require('bcrypt-nodejs');
let passport = require('passport');
let dbconfig = require('../dbconfig/db-connect');


var csrfProtection = csrf();
router.use(csrfProtection);


/* GET users listing. */
router.get('/logout',isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/',notLoggedIn, function(req, res, next) {
  next();

});


router.get('/signin',function (req,res) {
  let message = req.flash('error');
  res.render('user/signin',{csrfToken:req.csrfToken(),message:message,hasError:message.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect:'/user/summary',
  failureRedirect:'/user/signin',
  failureFlash:true
}));

router.get('/signup',function (req,res) {
  let message = req.flash('error');
  res.render('user/signup',{csrfToken:req.csrfToken(),message:message,hasError:message.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect:'/user/signin',
  failureRedirect:'/user/signup',
  failureFlash:true
  }));


router.get('/assistants', function(req, res, next) {
  res.render('user/assistants');
});

router.get('/calender', function(req, res, next) {
  res.render('user/calender');
});

router.get('/account', function(req, res, next) {
  res.render('user/account');
});

router.get('/reservation', function(req, res, next) {
  res.render('user/reservation');
});

router.get('/update',isLoggedIn, function(req, res, next) {
  res.render('user/update');
});

router.get('/book', function(req, res, next) {
  res.render('user/book');
});

router.get('/date', function(req, res, next) {
  res.render('user/date');
});

router.get('/summary',isLoggedIn, function(req, res, next) {
  res.render('user/summary');
});

router.get('/payment',isLoggedIn, function(req, res, next) {
  res.render('user/payment');
});




function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/');
}
function notLoggedIn(req, res, next) {
  if(!req.isAuthenticated()){
      return next();
  }
  res.redirect('/');
}


module.exports = router;
