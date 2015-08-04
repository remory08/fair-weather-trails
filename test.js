var Orbit = function () {}

Orbit.prototype.get = function (path, fn) {
  var req = new XMLHttpRequest()
  req.open('GET', path)
  req.send()
  req.addEventListener('load', fn.bind(req))
}

var trails = new Orbit();
trails.get('/locations', function(){
  console.log(JSON.parse(this.response))
})
