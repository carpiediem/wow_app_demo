const _ = require('lodash');
const passport = require('passport');
const request = require('request');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using id and security code.
 */
passport.use(new LocalStrategy({ usernameField: 'id', passwordField: 'securityCode' }, (username, password, done) => {
  User.findById(username, function(err, user) {
    if (err || !user) {
      return die('User not found for this ID.  Please request another security code.');
    }

    // If we find the user, let's validate the token they entered
    user.verifyAuthyToken(password, function(err) {
      if (err) { return done(err); }

      user.verified = true;
      user.save();
      return done(null, user);
    });
  });
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
