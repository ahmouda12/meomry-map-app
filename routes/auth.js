const express    = require("express");
const authRoutes = express.Router();
const passport   = require("passport");

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Signup
authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

authRoutes.post('/signup', (req, res, next) => {

  const {firstname, lastname, email, password} = req.body;

  if (email === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Enter both email and password to sign up.'
    });
    return;
  }

  User.findOne({ email: email }, '_id', (err, existingUser) => {
    if (err) {
      next(err);
      return;
    }

    if (existingUser !== null) {
      res.render('auth/signup', {
        errorMessage: `The email ${email} is already in use.`
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(password, salt);

    const userSubmission = {
      firstname,
      lastname,
      email,
      password: hashedPass
    };

    const theUser = new User(userSubmission);

    theUser.save((err) => {
      if (err) {
        res.render('auth/signup', {
          errorMessage: 'Something went wrong. Try again later.'
        });
        return;
      }
      res.redirect('/');
    });
  });
});

// Login
authRoutes.get('/', (req, res, next) => {
  res.render('index', {
    errorMessage: ''
  });
});

authRoutes.post('/', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === '' || password === '') {
    res.render('index', {
      errorMessage: 'Enter both email and password to log in.'
    });
    return;
  }

  User.findOne({ email: email }, (err, theUser) => {
    if (err || theUser === null) {
      res.render('index', {
        errorMessage: `There isn't an account with email ${email}.`
      });
      return;
    }

    if (!bcrypt.compareSync(password, theUser.password)) {
      res.render('index', {
        errorMessage: 'Invalid password.'
      });
      return;
    }

    req.session.currentUser = theUser;
    res.redirect(`/${theUser.firstname}/dashboard`);
  });
});

// Facebook Login
authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/user",
  failureRedirect: "/"
}));

// Google Login
authRoutes.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

authRoutes.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "/user",
  failureRedirect: "/"
}));

// Logout
authRoutes.get('/logout', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/');
  });
});

module.exports = authRoutes;