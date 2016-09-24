const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  req.assert('phone', 'Phone number cannot be blank').notEmpty();
  req.assert('countryCode', 'Country code error').notEmpty();
  req.assert('isValid', 'This phone number does not appear to be valid').isTrue();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }


  var query = {
    phone: req.body.phone,
    countryCode: req.body.countryCode
  };

  User.findOne({ phone: req.body.phone }, (err, user) => {
    if (err) { return done(err); }
    if (user) {
      // If this phone number has been used in the past, mark it as unverified again
      user.verified = false;
      user.save();
    } else {
      // Otherwise, create a new user instance
      user = new User(query);
    }

    user.sendAuthyToken(function(err) {
        if (err) {
            req.flash('errors', 'There was a problem sending '
                + 'your token - sorry :(');
        }

        // Send to token verification page
        res.redirect('/verify?id=' + user._id);
    });

  });

};

/**
 * GET /verify
 * Verify page.
 */
exports.getVerify = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/verify', {
    title: 'Verify SMS Code'
  });
};

/**
 * POST /verify
 * Verify SMS code to complete sign in.
 */
exports.postVerify = (req, res, next) => {
  req.assert('securityCode', 'Security code cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect( req.url );
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);

};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
