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
      passport.authenticate('local', (err, user, info) => {
        // If an exception is thrown, error will have VALUE and we'll want to call next with the error
        if (err) { return next(err) }
        // If authenticated, user has VALUE, if we're at this line of code, then the user is truthy and err is falsey
        req.login(user, error => {
          if (error) next(error)
          req.flash('success', 'Thank you for signing up!');
          req.session.save(() => {
            return res.redirect('/');
          });
        })
      })(req, res, next);
    } else {
      // if not created, the email already exists
      req.flash('error', 'There is already an accound associated with that email');
      req.session.save(() => {
        res.redirect('/auth/signup');
      });
    }
  }).catch(error => {
    // if an error occurs, let's see what the error is
    console.log('💩 ' + error.message);
    req.flash('error', error.message);
    req.session.save(() => {
      res.redirect('/auth/signup');
    });
  });
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    // if authentication failed, err: null and user: false
    if (!user) {
      req.flash('error', 'Invalid Username or password');
      req.session.save(() => {
        return res.redirect('/auth/login');
      });
    }
    // If an exception is thrown, error will have VALUE and we'll want to call next with the error
    if (err) { return next(err) }
    // If authenticated, user has VALUE, if we're at this line of code, then the user is truthy and err is falsey
    req.login(user, error => {
      if (error) next(error)
      req.flash('success', 'You are Valid');
      req.session.save(() => {
        return res.redirect('/');
      });
    })
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Smell ya later!');
  req.session.save(() => {
    res.redirect('/');
  });
});

module.exports = router;
