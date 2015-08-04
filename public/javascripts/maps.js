 var Orbit = function () {}

 Orbit.prototype.get = function (path, fn) {
	 var req = new XMLHttpRequest()
	 req.open('GET', path)
	 req.send()
	 req.addEventListener('load', fn.bind(req))
 }


 //starts the map
 function initialize() {

	 var trails = new Orbit();
	 trails.get('/locations', function(){
		 console.log(JSON.parse(this.response))
	 })
	 // use orbit for a get request to the /trails/index route
	 var trailInfo = JSON.parse(this.response)
	var myLatlng = new google.maps.LatLng(39.817147, -105.075545);
   var mapCanvas = document.getElementById('map-canvas');
   var mapOptions = {
      center: new google.maps.LatLng(38.9709948,-105.5589686),
       zoom: 7,
       mapTypeId: google.maps.MapTypeId.ROADMAP
   }
   var map = new google.maps.Map(mapCanvas, mapOptions);

	 var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
      content: contentString
  });

	 var marker = new google.maps.Marker({
			 position: myLatlng,
			 map: map,
			 title: 'Ryne\'s House!'
	 });

	 google.maps.event.addListener(marker, 'click', function() {
	infowindow.open(map,marker);
	});
 }
 google.maps.event.addDomListener(window, 'load', initialize);



 //
 // function initialize() {
 //  var mapOptions = {
 // 	 center: { lat: -34.397, lng: 150.644},
 // 	 zoom: 8
 //  };
 //  var map = new google.maps.Map(document.getElementById('map-canvas'),
 // 		 mapOptions);
 // }
 // google.maps.event.addDomListener(window, 'load', initialize);


/* Pull local Farers market data from the USDA API and display on
** Google Maps using GeoLocation or user input zip code. By Paul Dessert
** www.pauldessert.com | www.seedtip.com
*/

// $(function() {
//
// 		// var marketId = []; //returned from the API
// 		var allLatlng = []; //returned from the API
// 		var allMarkers = []; //returned from the API
// 		// var marketName = []; //returned from the API
// 		var infowindow = null;
// 		var pos;
// 		var userCords;
// 		var tempMarkerHolder = [];
//
// 		//Start geolocation
//
// 		if (navigator.geolocation) {
//
// 			function error(err) {
// 				console.warn('ERROR(' + err.code + '): ' + err.message);
// 			}
//
// 			function success(pos){
// 				userCords = pos.coords;
//
// 				//return userCords;
// 				console.log(userCords)
// 			}
//
// 			// Get the user's current position
// 			navigator.geolocation.getCurrentPosition(success, error);
// 			//console.log(pos.latitude + " " + pos.longitude);
// 			} else {
// 				alert('Geolocation is not supported in your browser');
// 			}
//
// 		//End Geo location
//
// 		//map options
// 		var mapOptions = {
// 			zoom: 5,
// 			center: new google.maps.LatLng(37.09024, -100.712891),
// 			panControl: false,
// 			panControlOptions: {
// 				position: google.maps.ControlPosition.BOTTOM_LEFT
// 			},
// 			zoomControl: true,
// 			zoomControlOptions: {
// 				style: google.maps.ZoomControlStyle.LARGE,
// 				position: google.maps.ControlPosition.RIGHT_CENTER
// 			},
// 			scaleControl: false
//
// 		};
//
// 	//Adding infowindow option
// 	infowindow = new google.maps.InfoWindow({
// 		content: "holding..."
// 	});
//
// 	//Fire up Google maps and place inside the map-canvas div
// 	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//
// 	//grab form data
//     $('#chooseLocation').submit(function() { // bind function to submit event of form
//
// 		//define and set variables
// 		var userCity = $("#userCity").val();
// 		var userState = $("#userState").val();
// 		var userRadius = $("#userRadius").val();v
// 		//console.log("This-> " + userCords.latitude);
//
// 		var accessURL;
//
// 		if(userCity && userState){
// 			accessURL = 'https://outdoor-data-api.herokuapp.com/api.json?api_key=' + process.env.TRAILS_API_KEY+'&q[city_eq]='+userCity+'&q[state_eq]='+userState;
// 		} else {
// 			accessURL = 'https://outdoor-data-api.herokuapp.com/api.json?api_key=' + process.env.TRAILS_API_KEY+'?lat=' + userCords.latitude + '&lng=' + userCords.longitude+'&radius='+userRadius;
// 		}
//
//
// 			//Use the zip code and return all market ids in area.
// 			$.ajax({
// 				type: "GET",
// 				contentType: "application/json; charset=utf-8",
// 				url: accessURL,
// 				dataType: 'json',
// 				success: function (data) {
//
// 					 $.each(data.results, function (i, val) {
// 						marketId.push(val.id);
// 						marketName.push(val.marketname);
// 					 });
//
// 					//console.log(marketName);
//
// 					var counter = 0;
// 					//Now, use the id to get detailed info
// 					$.each(marketId, function (k, v){
// 						$.ajax({
// 							type: "GET",
// 							contentType: "application/json; charset=utf-8",
// 							// submit a get request to the restful service mktDetail.
// 							url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + v,
// 							dataType: 'jsonp',
// 							success: function (data) {
//
// 							for (var key in data) {
//
// 								var results = data[key];
//
// 								//console.log(results);
//
// 								//The API returns a link to Google maps containing lat and long. This pulls it apart.
// 								var googleLink = results['GoogleLink'];
// 								var latLong = decodeURIComponent(googleLink.substring(googleLink.indexOf("=")+1, googleLink.lastIndexOf("(")));
//
// 								var split = latLong.split(',');
// 								var latitude = split[0];
// 								var longitude = split[1];
//
// 								//set the markers.
// 								myLatlng = new google.maps.LatLng(latitude,longitude);
//
// 								allMarkers = new google.maps.Marker({
// 									position: myLatlng,
// 									map: map,
// 									title: marketName[counter],
// 									html:
// 											'<div class="markerPop">' +
// 											'<h1>' + marketName[counter].substring(4) + '</h1>' + //substring removes distance from title
// 											'<h3>' + results['Address'] + '</h3>' +
// 											'<p>' + results['Products'].split(';') + '</p>' +
// 											'<p>' + results['Schedule'] + '</p>' +
// 											'</div>'
// 								});
//
// 								//put all lat long in array
// 								allLatlng.push(myLatlng);
//
// 								//Put the marketrs in an array
// 								tempMarkerHolder.push(allMarkers);
//
// 								counter++;
// 								//console.log(counter);
// 							};
//
// 								google.maps.event.addListener(allMarkers, 'click', function () {
// 									infowindow.setContent(this.html);
// 									infowindow.open(map, this);
// 								});
//
//
// 								//console.log(allLatlng);
// 								//  Make an array of the LatLng's of the markers you want to show
// 								//  Create a new viewpoint bound
// 								var bounds = new google.maps.LatLngBounds ();
// 								//  Go through each...
// 								for (var i = 0, LtLgLen = allLatlng.length; i < LtLgLen; i++) {
// 								  //  And increase the bounds to take this point
// 								  bounds.extend (allLatlng[i]);
// 								}
// 								//  Fit these bounds to the map
// 								map.fitBounds (bounds);
//
//
// 							}
// 						});
// 					}); //end .each
// 				}
// 			});
//
//         return false; // important: prevent the form from submitting
//     });
// });
module.exports= trails;
