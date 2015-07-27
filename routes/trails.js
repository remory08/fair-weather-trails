var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var trails = db.get('trails');
var unirest = require('unirest');

router.get('/', function (req, res, next) {
  res.render('trailSearch', {user: req.session.user})
})

router.get('/index', function(req, res) {
    unirest.get('https://outdoor-data-api.herokuapp.com/api.json?api_key=' + process.env.TRAILS_API_KEY+'&q[city_eq]='+req.query.city+'&q[state_eq]='+req.query.state+'&radius='+req.query.radius)
      .end(function (trails) {
        unirest.get('http://api.wunderground.com/api/' + process.env.WEATHER_API_KEY +'/forecast/q/CO/'+req.query.city+'.json')
          .end(function (weather) {
          res.render('trails-index', {city: req.query.city, trails: trails.body.places, user: req.session.user, weather: weather.body.forecast.txt_forecast.forecastday})
          })
      })
})

router.get('/viewtrail/:id', function(req, res,next) {
  unirest.get('https://outdoor-data-api.herokuapp.com/api.json?api_key=' + process.env.TRAILS_API_KEY+'&q[name_eq]='+req.query.name)
  // console.log(req.params.id)
  // req.params.id = unique_id
  .end(function (trail) {
    trail = trail.body.places.shift()
    unirest.get('http://api.wunderground.com/api/' + process.env.WEATHER_API_KEY +'/forecast/q/CO/'+trail.city+'.json')
    .end(function(weather) {
      res.render('show', {trail: trail, user: req.session.user, weather: weather.body.forecast.txt_forecast.forecastday})
    })
  })
});



module.exports=router;
