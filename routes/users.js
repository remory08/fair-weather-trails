var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var trails = db.get('trails');
var bcrypt = require('bcryptjs');
var unirest = require ('unirest');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('hello');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res) {
  var errors = [];
  // console.log(req.body)
  if(req.body.email === '') {
    errors.push("Email cannot be blank" );
  }
  if (!req.body.password) {
    errors.push("Password cannot be blank")
  }
  if (errors.length) {
    res.render('register', {errors: errors})
  }
   else {
    users.find({email: req.body.email}, function (err, docs) {
        if (docs.length === 0) {
          var user = req.body;
          user.savedTrails = [];
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
          users.insert(user, function(err, doc) {
            if (err) return err;
            req.session.id = doc._id;
            // console.log("req session = " + req.session)
            res.redirect('/users/login')
          })
        } else {
          errors.push("user already exists, please login")
          res.render('register', {errors: errors})
        }
    })
  }
})

router.get('/register/google', function(req, res, next) {
  console.log(req.session)
  res.render('/users/profile/:id', {displayName: res.body.displayName});
});

router.get('/login', function(req, res, next) {
  res.render('login', { });
});

router.post('/login', function(req, res) {
  var loginErrors = [];
  if(!req.body.email) {
    loginErrors.push("Please enter your email");
  }
  if (!req.body.password) {
    loginErrors.push('Please enter your password')
  }
  if (loginErrors.length) {
    res.render('login', {loginErrors: loginErrors, content: req.body})
  }
  else {
    users.findOne({email: req.body.email}, function (err, doc) {
      if (err) return err;
      // if (req.body.password === doc.password) {
      if (doc) {
        // console.log(doc._id)
        if (bcrypt.compareSync(req.body.password, doc.password)) {
          // console.log(doc)
          req.session.id = doc._id;
          req.session.user = doc.name;
          res.redirect('./profile/:id')
        }
        else {
          loginErrors.push('Incorrect email and password combo')
          res.render('login', {loginErrors: loginErrors})
        }
      }
      else {
        loginErrors.push('User not found. Please register')
        res.render('login', {loginErrors: loginErrors})
      }
    })
  }
})

router.get('/logout', function(req, res) {
  req.session = null
  res.redirect('/')
})

router.get('/profile/trails/:id', function(req, res, next) {
  // console.log(req.query)
  trails.findOne({_id: req.query.trailId}, function (err, trail) {
    if (err) return err
    console.log(trail)
    console.log(trail.city)
    unirest.get('http://api.wunderground.com/api/' + process.env.WEATHER_API_KEY +'/forecast/q/'+trail.state+'/'+trail.city+'.json')
      .end(function(weather) {
        res.render('saved-trail', {user: req.session.user, trail: trail, weather: weather.body.forecast.txt_forecast.forecastday})
      })
  })
})

router.post('/profile/trails/:id', function (req, res, next) {
  trails.findOne({_id: req.body.trailId}, function (err, trail) {
    if (err) return err
    users.update({name: req.session.user}, {$pull: {savedTrails: trail._id}}, function(err, data) {
      //db.users.update({name: 'Ryne'}, {$pull: {savedTrails: ObjectId("55b596ef97427b898a1a3c48") }}) === works in mongo shell!!!
      if (err) return err
      res.redirect('/users/profile/:id')
    })
  })
})

router.get('/profile/:id', function (req, res) {
  // console.log(req.session)
  users.findOne({_id: req.session.id}, function(err, user) {
      if (err) return err
      trails.find({_id: {$in: user.savedTrails}}, function (err, trails) {
        if (err) return err
        // console.log(trails);
        res.render('profile', {user: req.session.user, trails: trails})
      })
  })
});

router.post('/profile/:id', function(req, res, next) {
  // console.log(req.body)
  unirest.get('https://outdoor-data-api.herokuapp.com/api.json?api_key=' + process.env.TRAILS_API_KEY+'&q[name_eq]='+req.body.name)
  .end(function (trail) {
    trail = trail.body.places.shift()
    trails.insert(trail, function (err, doc){
      if (err) return err
      // console.log(doc._id)
      users.update({_id: req.session.id}, {$push: {savedTrails: doc._id}})
      users.findOne({_id: req.session.id}, function (err, user) {
        if (err) return err
        trails.find({_id: {$in: user.savedTrails}}, function (err, trails) {
          if (err) return err
          res.render('profile', {trails: trails, user: req.session.user})
        })
      })
    })
  })
});


module.exports = router;
