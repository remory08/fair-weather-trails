var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var trails = db.get('trails');
var unirest = require('unirest');

router.get('/', function (req, res, next) {
  res.render('trailSearch')
})

// router.get('/index', function (req, res, next) {
//   // console.log(req.params) = empty object
//   // console.log(res.body) = undefined
//   res.render('trails-index', {})
// })

router.get('/index', function(req, res) {
    // console.log(req)
    // console.log(res)
    unirest.get('https://outdoor-data-api.herokuapp.com/api.json?api_key=' + process.env.TRAILS_API_KEY+'&q[city_cont]=Aspen&radius=15')
      .end(function (response) {
        console.log(response.body.places.activities);
      res.render('trails-index', {trails: response.body.places})
      })
})



router.get('/:id', function(req, res,next) {
  trails.findOne({_id: req.params.id}, function(err, doc) {
    if (err) return err;
    res.render('show', {trail: doc})
  })
});



// router.get('/search', function (req, res, next) {
//   res.render('trailSearch')
// })

module.exports=router;
