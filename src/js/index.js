import app from './app';

const quakes = Rx.Observable.create(observer => {
  window.eqfeed_callback = response => {
    observer.onNext(response);
    observer.onCompleted();
  };

  loadJSONP(QUAKE_URL);
}).flatMap(response => Rx.Observable.from(response.features))

quakes.subscribe(quake => {
  const [ coord0, coord1 ] = quake.geometry.coordinates;
  const size = quake.properties.mag * 10000;

  L.circle([ coord1, coord0 ], size).addTo(map);
});