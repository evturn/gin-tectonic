(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, function () { 'use strict';

  console.log('me like the way you work it. no diggity.')

  const MAP = L.map('map').setView([33.858631, -118.279602], 7);
  const req = {
    url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp',
    jsonpCallback: 'eqfeed_callback'
  };

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(MAP);

  const quakeLayer = L.layerGroup([]).addTo(MAP);

  const COLOR_PRIMARY ='#0000ff';
  const COLOR_HOVER = '#ff0000';

  // import App from './components/App';

  const codeLayers = {};
  const table = document.getElementById('data-list');

  function makeRow(props) {
    const { net, code, place, mag, time } = props;
    const date = new Date(time);
    const columns = [place, mag, date.toString()];
    const row = document.createElement('ul');

    row.id = net + code;
    row.className = 'row';

    columns.forEach(text => {
      const cell = document.createElement('li');

      cell.className = 'cell';
      cell.textContent = text;
      row.appendChild(cell);
    });

    return row;
  }

  function getRowFromEvent(event) {
    return Rx.Observable
      .fromEvent(table, event)
      .filter(e => e.target.className === 'cell' && e.target.parentNode.id.length)
      .pluck('target', 'parentNode')
      .distinctUntilChanged();
  }

  function initialize() {
    const quakes = Rx.Observable
      .interval(5000)
      .flatMap(() => Rx.DOM.jsonpRequest(req).retry(3))
      .flatMap(result => Rx.Observable.from(result.response.features))
      .distinct(quake => quake.properties.code)
      .share();

    quakes.subscribe(quake => {
      const [ lng, lat ] = quake.geometry.coordinates;
      const size = quake.properties.mag * 10000;
      const circle = L.circle([ lat, lng ], size).addTo(MAP);

      quakeLayer.addLayer(circle);
      codeLayers[quake.id] = quakeLayer.getLayerId(circle);
    });

    getRowFromEvent('mouseover')
      .pairwise()
      .subscribe(rows => {
        const [ prev, curr ] = rows;
        const prevCircle = quakeLayer.getLayer(codeLayers[prev.id]);
        const currCircle = quakeLayer.getLayer(codeLayers[curr.id]);

        prevCircle.setStyle({ color: COLOR_PRIMARY });
        currCircle.setStyle({ color: COLOR_HOVER });
      });

    getRowFromEvent('click')
      .subscribe(row => {
         const circle = quakeLayer.getLayer(codeLayers[row.id]);

         MAP.panTo(circle.getLatLng());
      });

    quakes
      .pluck('properties')
      .map(makeRow)
      .subscribe(row => table.appendChild(row));
  }

  Rx.DOM.ready().subscribe(initialize);

}));