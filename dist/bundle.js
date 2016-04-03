(function () {
  'use strict';

  console.log('me like the way you work it. no diggity.')

  var map = L.map('map').setView([33.858631, -118.279602], 7);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  const quakes = Rx.DOM.jsonpRequest({
    url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/' + 'summary/all_day.geojsonp',
    jsonpCallback: 'eqfeed_callback'
  })
  .flatMap(result => Rx.Observable.from(result.response.features))
  .map(quake => {
    const [ lng, lat ] = quake.geometry.coordinates;
    const size = quake.properties.mag * 10000;

    return { lat, lng, size };
  });

  quakes.subscribe(quake => L.circle([ quake.lat, quake.lng ], quake.size).addTo(map));

}());