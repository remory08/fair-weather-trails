var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').load();
var cookieSession = require('cookie-session');
var unirest = require('unirest');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var hbs = require('hbs');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cookieSession({
  name: 'session',
  keys: [process.env.KEY1, process.env.KEY2]
}))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1)

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ['r_emailaddress', 'r_basicprofile'],
    state: true
  }, function(accessToken, refreshToken, profile, done) {
    done(null, {id: profile.id, displayName: profile.displayName, token: accessToken})
  }));

  app.get('/auth/google',
    passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/users/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

passport.serializeUser(function(user, done) {
  console.log(user)
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user)
});

app.use(function (req, res, next) {
  res.locals.user = req.user
  next()
})

app.use('/', routes);
app.use('/users', users);
app.get('/styleguide', function (req, res) {res.render('styleguide')})

app.get('/trails', function(req, res) {
    unirest.get('https://outdoor-data-api.herokuapp.com/api.json?api_key=' + process.env.TRAILS_API_KEY)
      .end(function (response) {
        console.log(response.body);
      })
})

app.get('/weather', function(req, res) {
    unirest.get('http://api.wunderground.com/api/' + process.env.WEATHER_API_KEY +'/forecast/q/CO/Boulder.json')
      .end(function (response) {
        console.log(response.body.forecast.txt_forecast.forecastday); //returns an array of periods for which I'll need to iterate over in handlebars
      res.end()
      })
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
