var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var trails = db.get('trails');
var bcrypt = require('bcryptjs');

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
            res.redirect('../')
          })
        } else {
          errors.push("user already exists, please login")
          res.render('register', {errors: errors})
        }
    })
  }
})

router.get('/register/google', function(req, res, next) {
  res.render('', {displayName: res.body.displayName});
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
          res.redirect('/users/:id')
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

router.get('/:id', function (req, res) {
  users.findOne({_id: req.session.id}, function (err, doc) {
    console.log(req.session.id)
    if (err) return err;
    res.render('profile', {users: doc})
  })
});

router.post('/:id', function(req, res, next) {
  trails.findOne({_id: req.params.id}, function (err, trail) {
    if (err)  return err
    users.findOne({_id: req.session.id}, function (err, user) {
      users.insert({trails: trail._id}, function (err, doc) {
        if (err) return err
        res.redirect('/:id')
      })
    })
  })
});


module.exports = router;
