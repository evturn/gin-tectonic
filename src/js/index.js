import app from './app';

const quakes = Rx.DOM.jsonpRequest({
  url: QUAKE_URL,
  jsonpCallback: 'eqfeed_callback'
})
.flatMap(result => Rx.Observable.from(result.response.features))
.map(quake => {
  const [ lng, lat ] = quake.geometry.coordinates;
  const size = quake.properties.mag * 10000;

  return { lat, lng, size };
});

quakes.subscribe(quake => L.circle([ quake.lat, quake.lng ], quake.size).addTo(map));