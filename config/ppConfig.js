// Requirements
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

// Passport will serialize objects; converts the user to an identifier (id)
passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

// Passport deserializing an object; finds user in db via serialized identifier (id)
passport.deserializeUser((id, cb) => {
    db.user.findByPk(id).then(user => {
        cb(null, user);
    }).catch(err => {
        cb(err, null)
    });
})

// Passport using it's Strategy to provide local auth. We need to give the LocalStrategy the following info:

//  Configuration: an object of data to identify our auth fields (username, password)

// Callback function: a function that is called to log the user in. We can pass the email and password to a db query, and return the appropriate information in the callback. (login(error, user) {do some stuff})
    // provide "null" if no error, or "false" if there's no user

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, cb) => {
    // look for a user and cb accordingly
    db.user.findOne({
        where: { email }
    }).then(user => {
        // if there is a user AND the user has a valid password
        if (user && user.validPassword(password)) {
            console.log(`👑 User with email ${user.email} is valid`);
            // no error, give the user
            cb(null, user);
        } else {
            console.log('👿 Invalid Credentials');
            // no error, false user
            cb(null, false);
        }
    }).catch(cb);
}));

// export the configured passport
module.exports = passport;