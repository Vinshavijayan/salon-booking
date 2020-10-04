let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let bcrypt = require('bcrypt-nodejs');
let validator = require('express-validator');
var express = require('express');
let dbconfig = require('../dbconfig/db-connect');


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    name = req.body.name;
    email = req.body.email;
    password = req.body.password;
    mobile = req.body.mobile;

    dbconfig.get().collection('user').findOne({ 'email': email }, function (err, user) {
        console.log(email);

        if (err) {
            console.log('err case');
            return done(err);
        }
        if (user) {
            console.log('Email is already in use.');
            return done(null, false, { message: 'Email is already in use.' });
        }
        console.log('Creating New User');

        password = bcrypt.hashSync(password, bcrypt.genSaltSync(), null);

        dbconfig.get().collection('user').insertOne({
            name: name,
            email: email,
            password: password,
            mobile : mobile
        }, function (err, data) {
            if (err) {
                return done(err);
            }
            return done(null, email)
        });
        console.log('success')
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    email = req.body.email;
    password = req.body.password;

    dbconfig.get().collection('user').findOne({ email: email }, function (err, user) {
        if (!err) {
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    console.log(email + ' login Success');
                    return done(null, user);
                } else {
                    console.log(email + ' Wrong Password');
                    return done(null, false, { message: 'Wrong Password' });
                }

            } else {
                console.log('No User Found');
                return done(null, false, { message: 'No user Found' })
            }

        } else {
            console.log('Server Error');
            return done(err)
        }
    });

}));