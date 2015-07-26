var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var trails = db.get('trails');
var unirest = require('unirest');

router.get('/', function (req, res, next) {
  res.render('trailSearch')
})


router.get('/index', function(req, res) {
    // console.log(req)
    // console.log(req)
    // console.log(res)
    // console.log(req.query.state)
    unirest.get('https://outdoor-data-api.herokuapp.com/api.json?api_key=' + process.env.TRAILS_API_KEY+'&q[city_eq]='+req.query.city+'&q[state_eq]='+req.query.state+'&radius='+req.query.radius)
      .end(function (trails) {
        // console.log(trails.body.places);
        unirest.get('http://api.wunderground.com/api/' + process.env.WEATHER_API_KEY +'/forecast/q/CO/'+req.query.city+'.json')
          .end(function (weather) {
          // console.log(weather.body.forecast.txt_forecast.forecastday); //returns an array of periods for which I'll need to iterate over in handlebars
          res.render('trails-index', {city: req.query.city, trails: trails.body.places, user: req.session.user, weather: weather.body.forecast.txt_forecast.forecastday})
          })
      })
})



router.get('/viewtrail/:id', function(req, res,next) {
  unirest.get('https://outdoor-data-api.herokuapp.com/api.json?api_key=' + process.env.TRAILS_API_KEY+'&q[name_eq]='+req.query.name)
  // console.log(req.query)
  // console.log(req.params.id)
  // req.params.id = unique_id
  .end(function (trail) {
    console.log(trail.body.places)
    res.render('show', {trail: trail.body.places})
  })
});

// router.post('/viewtrail/:id', function(req, res, next) {
//   unirest.get('https://outdoor-data-api.herokuapp.com/api.json?api_key=' + process.env.TRAILS_API_KEY+'&q[name_eq]='+req.query.name)
//   .end(function (trail) {
//     trails.insert({trail}, function (err, doc) {
//       if (err) return err
//       console.log(doc)
//       users.findOne({_id: req.session.id}, function (err, user) {
//         users.
//       })
//     })
//     res.render('show', {trail: trail.body.places})
//   })
// })


// router.get('/search', function (req, res, next) {
//   res.render('trailSearch')
// })

module.exports=router;
