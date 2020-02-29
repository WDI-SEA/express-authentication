const express = require('express');
const router = express.Router();
const passport = require('../config/ppConfig');
const db = require('../models');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res) => {
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).then(([user, created]) => {
    if (created) {
      // if created, success and redirect home
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Thanks for signing up!'
      })(req, res);
    } else {
      // if not created, the email already exists
      req.flash('error', 'There is already an accound associated with that email');
      res.redirect('/auth/signup');
    }
  }).catch(error => {
    // if an error occurs, let's see what the error is
    console.log('💩 ' + error.message);
    req.flash('error', error.message);
    res.redirect('/auth/signup');
  });
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: 'Welcome back',
  failureRedirect: '/auth/login',
  failureFlash: 'Try again tipship'
}));

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Smell ya later!');
  res.redirect('/');
});

module.exports = router;
