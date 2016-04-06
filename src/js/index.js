import { MAP, req } from './api';

const COLOR_PRIMARY ='#0000ff';
const COLOR_HOVER = '#ff0000';
const codeLayers = {};
const quakeLayer = L.layerGroup([]).addTo(MAP);
const identity = Rx.helpers.identity;
const table = document.getElementById('quakes_info');

function makeRow(props) {
  const { net, code, place, mag, time } = props;
  const date = new Date(time);
  const row = document.createElement('tr');

  row.id = net + code;

  [place, mag, date.toString()].forEach(text => {
    const cell = document.createElement('td');

    cell.textContent = text;
    row.appendChild(cell);
  });

  return row;
}

function getRowFromEvent(event) {
  return Rx.Observable
    .fromEvent(table, event)
    .filter(e => e.target.tagName === 'TD' && e.target.parentNode.id.length)
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