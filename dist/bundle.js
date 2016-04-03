(function () {
  'use strict';

  console.log('me like the way you work it. no diggity.')

  const map = L.map('map').setView([33.858631, -118.279602], 7);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  const req = {
    url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/' + 'summary/all_day.geojsonp',
    jsonpCallback: 'eqfeed_callback'
  };

  const quakes = Rx.Observable
    .interval(5000)
    .flatMap(() =>
      Rx.DOM.jsonpRequest(req).retry(3)
    )
    .flatMap(result =>
      Rx.Observable.from(result.response.features)
    )
    .distinct(quake => quake.properties.code);

    quakes.subscribe(quake => {
    const [ lng, lat ] = quake.geometry.coordinates;
    const size = quake.properties.mag * 10000;

    L.circle([ lat, lng ], size).addTo(map)
  });

}());