const express = require('express');
const router = express.Router();
const db = require('../models');

// mounted at /auth

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

// Sign up POST route
router.post('/signup', (req, res) => {
  // findOrCreate a new user based on email
  db.user.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).then(([user, created]) => {
    // if the user WAS created
    if (created) {
      // redirect to homepage or profile
      console.log(`😎 ${user.name} was created!`);
      console.log(user.validPassword('butts'))
      res.redirect('/');
    } else { // else (there is a user at that email so they can't sign up)
    console.log(`⛔️ ${user.name} already exists!`);
    console.log(user.validPassword('butts'))
      // redirect to /auth/signup 
      res.redirect('/auth/signup');
    }
  }).catch(err => {
    console.log(`🐻 Bad news bears, there's an error!`);
    console.log(err);
    // if there is an error, it's probably a validation error, so we'll return to /auth/signup
    res.redirect('/auth/signup');
  })
});


router.get('/login', (req, res) => {
  res.render('auth/login');
});

module.exports = router;
