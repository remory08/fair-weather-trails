var trailId = [];
var allLatlng = [];
var allMarkers = [];
var trailName = [];
var infoWindow = null;
var pos;
var userCords;
var tempMarkerHolder = [];


var mapOptions = {
  zoom: 5,
  center: new google.maps.LatLng(37,09024, -100.712891)
  panControl: false,
  panControlOptions: {
    position: google.maps.ControlPosition.BOTTOM_LEFT
  },
  zoomControl: true,
  zoomControlOptions: {
    style: google.maps.ZoomControlStyle.LARGE,
    position: google.maps.ControlPosition.RIGHT_CENTER
  },
  scaleControl: false
};

infoWindow = new google.maps.InfoWindow({
  content: "trail info will go here, and perhaps weather"
})

map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions)

// jQuery - form with a 'choosezip id'
$('chooseZip').submit(function() {

  var userZip = $("#textZip").val() //form field where zip code is entered by user
  var accessURL;
  if (userZip) {
    //this doesn't include error handling for valid zip code
    accessURL = "http://search.ams.usda.gov/farmersmarkets"
  }
  else {
    accessURL = "some other url"
  }
  return false; // prevents the form from actually submitting and allows js to take over and run the function for the api query
})
