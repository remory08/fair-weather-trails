var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(req.session.user)
  res.render('index', {title: 'Fair Weather Trails', user: req.session.user});
});

// router.get('/locations', function(req, res, next) {
//   console.log(req.session.user)
//   res.render('index', {title: 'Fair Weather Trails', user: req.session.user});
// });


module.exports = router;
