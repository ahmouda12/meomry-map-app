require('dotenv').config();

const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const express        = require('express');
const favicon        = require('serve-favicon');
const hbs            = require('hbs');
const mongoose       = require('mongoose');
const logger         = require('morgan');
const path           = require('path');
const session        = require("express-session");
const bcrypt         = require("bcrypt");
const passport       = require("passport");
const LocalStrategy  = require("passport-local").Strategy;
const MongoStore     = require('connect-mongo')(session);
const FbStrategy     = require('passport-facebook').Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// User model
const User = require('./models/user');

// Place model
const Place = require('./models/place');

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/leaflet', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Session Middleware
app.use(session({
  secret: "Map your memeories",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use((req, res, next) => {
  if (req.session.currentUser) {
      console.log("HELLO!!!");

    // console.log(req.session.currentUser)
    res.locals.currentUserInfo = req.session.currentUser;
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }
  console.log("OUTSIDE");

  next();
});

// Passport Middleware
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Authentication Strategies
// Facebook Strategy
passport.use(new FbStrategy({
  clientID: "758803064510601",
  clientSecret: "2451e50360fff68bf075d36459588813",
  callbackURL: "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ facebookID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      facebookID: profile.id
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));

// Google Strategy 
passport.use(new GoogleStrategy({
  clientID: "204357653762-172ovt6hdk4sqp5o492skjndteuth28d.apps.googleusercontent.com",
  clientSecret: "SemUkJW5mTWYsI8b7G1GOqOK",
  callbackURL: "/auth/google/callback",
  passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
  User.findOne({ googleID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      console.log('req ===== ', user);
      req.res.locals.currentUserInfo = {firstName:'Alan'};
      // res.locals.isUserLoggedIn = true;
      return done(null, user);
    }

    const newUser = new User({
      googleID: profile.id
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));

app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Memory Map';



const index = require('./routes/index');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const placeRoutes = require("./routes/new-place");
app.use('/', index);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', placeRoutes);


module.exports = app;
