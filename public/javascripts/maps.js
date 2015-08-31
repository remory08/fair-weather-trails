 // var Orbit = function () {}
 //
 // Orbit.prototype.get = function (path, fn) {
 //  var req = new XMLHttpRequest()
 //  req.open('GET', path)
 //  req.send()
 //  req.addEventListener('load', fn.bind(req))
 // }
// - only choose one orbit function to run
// Orbit.prototype.post = function () {
// 	res.setHeader (application/json)
// }

// function placeMarker(location) {
// 	var marker = new google.maps.Marker({
// 		position: location,
// 		map: map,
// });
// }


 var mapInitialize = function () {


  var mapCanvas = document.getElementById('map-canvas');
  var mapOptions = {
     center: new google.maps.LatLng(38.9709948,-105.5589686),
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(mapCanvas, mapOptions);


  return map;
  // var results = [];
 //  for (var i = 0; i < trailsInfo.length; i++) {
 // 	 	results.push(trailInfo[i])
 //  		console.log(trailsInfo[i]);
 //  }
 //
 //  console.log(results)
 //
 //  for (var i = 0; i < results.length; i++) {
 // 	 var object = {}
 // 	 var latlng = new google.maps.LatLng(trails.lat, trails.lng);
 //
 // 	 var marker = new google.maps.Marker({
 // 			 position: latlng,
 // 			 map: map,
 // 			 title: results[i].title.toString()
 // 	 })
 // 	 object.name = results[i].name;
 // }
}

// var map = {
//   mapInitialize = function()
//   //create an object that knows how to "new" itself up and create new markers, etc
//   //refactoring to OO is great!
// }
