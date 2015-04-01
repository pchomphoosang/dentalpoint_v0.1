var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');

/**
 * POST /login  req.params, req.body, or req.query
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {

  //req.checkBody('email', 'Email is not valid').isEmail();
  //req.checkBody('password', 'Password cannot be blank').notEmpty();
/*
  var errors = {};//req.validationErrors();

  var messages = { };
  if (errors) {
    messages.error = errors;
    return res.json(messages);
    //return res.redirect('/login');
  }
*/
  passport.authenticate('local', function(err, user, info) {
    var response = { };
    if (err) return next(err);
    if (!user) {

      response.errors = { msg: info.message };
      return res.status(422).send(response);
      //return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      console.log("user: "+JSON.stringify(user));
      response.user = {  email : req.user.email, profile : req.user.profile, _id : user._id };
      response.success = { msg: 'Success! You are logged in.' };

      return res.json(response);     
      //res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  req.logout();
  response ={};
  response.success = { msg: 'Success! You are logged out.' };
  return res.json(response); 
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {

  /*
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  */
  /*
  var errors = req.validationErrors();

  if (errors) {
    //req.flash('errors', errors);
    messages.error = errors
    return res.json(messages);
    //return res.redirect('/signup');
  }
  */
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    var response =  { };
    if (existingUser) {

      response.errors = { msg: 'Account with that email address already exists.' };
      return res.status(422).send(response);
    }
    user.save(function(err) {
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);

        response.user = {  email : req.user.email, profile : req.user.profile, _id : user._id  };
        response.success = { msg: 'Success! You are Siguped.' };
        return res.json(response);
      });
    });
  });

};


/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function(req, res, next) {
  var response = {};
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';

    user.save(function(err) {
      if (err) return next(err);
      response.success =  { msg: 'Profile information updated.' };
      response.redirect =  { url: '#account' };
      return res.json(response);
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  var response = {};
  var errors = req.validationErrors();

  if (errors) {
    response.errors = {password : "Password must be at least 4 characters long"};
    response.errors = {confirmPassword : "Passwords do not match"};
    response.redirect =  { url: '#account' };
    return res.json(response);
  }

  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user.password = req.body.password;

    user.save(function(err) {
      if (err) return next(err);

      response.success =  { msg: 'Password has been changed.' };
      response.redirect = { url: '#account' };
      return res.json(response);
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = function(req, res, next) {
  var response = {};
  User.remove({ _id: req.user.id }, function(err) {
    if (err) return next(err);
    req.logout();
    response.info = { msg: 'Your account has been deleted.' };
    response.redirect =  { url: '#' };
    return response;
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function(req, res, next) {
  var response = {};
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });

    user.save(function(err) {
      if (err) return next(err);

      response.info = { msg: provider + ' account has been unlinked.' }
      response.redirect = { url: '#account' };
      return response;
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function(req, res) {
  var response = {};
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ resetPasswordToken: req.params.token })
    .where('resetPasswordExpires').gt(Date.now())
    .exec(function(err, user) {
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function(req, res, next) {

  //req.assert('password', 'Password must be at least 4 characters long.').len(4);
  //req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            if (err) return next(err);
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Your Hackathon Starter password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
        done(err);
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function(req, res, next) {

  var response = {};

  console.log("1:"+ JSON.stringify(req.body));
  console.log("2:"+ JSON.stringify(req.params));
  console.log("3:>>"+ req.body.email.length );
  
  if (req.body.email.length < 1) {
    //req.flash('errors', errors);
    response.errors = { email : "Please enter a valid email address."};
    response.redirect =  { url: '#forgot' };
    return res.json(response);
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
        if (!user) {
          //req.flash('errors', { msg: 'No account with that email address exists.' });
          //return res.redirect('/forgot');
          response.errors = { msg: 'No account with that email address exists.' };
          response.redirect =  { url: '#forgot' };
          return  res.json(response);
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: secrets.sendgrid.user,
          pass: secrets.sendgrid.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Reset your password on Hackathon Starter',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        //req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        response.info =  { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' };
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    //return res.redirect('#account/forgot');
    response.redirect =  { url: '#account/forgot' };
    return res.json(response);
  });
};
exports.getProfile = function(req, res, next) {


    var response = {};
    var keys = ['email','profile'];
    User.findOne({_id: req.params.id},function(err, user) {
    if (err) return next(err);

      if (user) {
        console.log("User:"+JSON.stringify(user));
        response = _.pick(user,keys);
        return res.json(response);
      }
    });

};
