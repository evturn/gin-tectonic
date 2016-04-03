var QUAKE_URL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/' + 'summary/all_day.geojsonp';

function loadJSONP(url) {
  var script = document.createElement('script');
  var head = document.getElementsByTagName('head')[0];

  script.src = url;
  head.appendChild(script);
}

var map = L.map('map').setView([33.858631, -118.279602], 7);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);