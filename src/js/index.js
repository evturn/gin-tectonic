import app from './app';

const quakes = Rx.Observable.create(observer => {
  window.eqfeed_callback = response => {
    response.features.forEach(tremor => observer.onNext(tremor));
  };

  loadJSONP(QUAKE_URL);
});

quakes.subscribe(quake => {
  const [ coord0, coord1 ] = quake.geometry.coordinates;
  const size = quake.properties.mag * 10000;

  L.circle([ coord1, coord0 ], size).addTo(map);
});