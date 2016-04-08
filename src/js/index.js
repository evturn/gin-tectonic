import { MAP, req, quakeLayer } from './api';
import { Observable } from 'rx';
import { DOM } from 'rx-dom';
import { COLOR_HOVER, COLOR_PRIMARY } from './constants';
import '../css/app.less';

const codeLayers = {};
const table = document.getElementById('data-list');
const header = document.getElementById('data-header');

function initialize() {
  const socket = DOM.fromWebSocket('ws://127.0.0.1:8080')

  const quakes = Observable.interval(5000)
    .flatMap(() => DOM.jsonpRequest(req).retry(3))
    .flatMap(result => Observable.from(result.response.features))
    .distinct(quake => quake.properties.code)
    .share();

  quakes.subscribe(renderQuakes);

  quakes.bufferWithCount(100)
    .subscribe(quakes => {
      const quakesData = quakes.map(quake => {
        const {
          properties: { net, code, mag },
          geometry: { coordinates: [ lng, lat ] }
        } = quake;

        const id = net + code;

        return { id, lat, lng, mag };
      });

      socket.onNext(JSON.stringify({ quakes: quakesData }));
    });

  socket.map(message => JSON.parse(message.data))
    .subscribe(data => {
      const container = document.getElementById('twitter');

      container.insertBefore(renderTweet(data), container.firstChild);
    });

  getRowFromEvent('mouseover')
    .pairwise()
    .subscribe(onHoverHighlightMapQuake);

  getRowFromEvent('click')
    .subscribe(onClickPanToQuake);

  getColumnFromEvent('click')
    .subscribe(e => {
      switch (e.target.id) {
        case 'loc':
          console.log('location!');
          break;
        case 'mag':
          console.log('magnitude!');
          break;
        case 'time':
          console.log('time!');
          break;
      }
    });

  quakes.pluck('properties')
    .map(renderRows)
    .subscribe(row => table.appendChild(row));
}

DOM.ready().subscribe(initialize);

function renderRows(props) {
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

function renderTweet(tweetObj) {
  const { avatar, text, date, time } = tweetObj;
  const content = `
    <div class="details">
      <img class="avatar" src="${avatar}" />
      <div class="text">${text}</div>
    </div>
    <div class="date">
      <div class="day">${date}</div>
      <div class="time">${time}</div>
    </div>
  `;
  const div = document.createElement('div');

  div.className = 'tweet';
  div.innerHTML = content;
  return div;
}

function renderQuakes(quake) {
  const [ lng, lat ] = quake.geometry.coordinates;
  const size = quake.properties.mag * 10000;
  const circle = L.circle([ lat, lng ], size).addTo(MAP);

  quakeLayer.addLayer(circle);
  codeLayers[quake.id] = quakeLayer.getLayerId(circle);
}

function getRowFromEvent(event) {
  return Observable.fromEvent(table, event)
    .filter(e => e.target.className === 'cell' && e.target.parentNode.id.length)
    .pluck('target', 'parentNode')
    .distinctUntilChanged();
}

function getColumnFromEvent(event) {
  return Observable.fromEvent(header, event)
}

function onHoverHighlightMapQuake(rows) {
  const [ prev, curr ] = rows;
  const prevCircle = quakeLayer.getLayer(codeLayers[prev.id]);
  const currCircle = quakeLayer.getLayer(codeLayers[curr.id]);

  prevCircle.setStyle({ color: COLOR_PRIMARY });
  currCircle.setStyle({ color: COLOR_HOVER });
}

function onClickPanToQuake(row) {
  const circle = quakeLayer.getLayer(codeLayers[row.id]);

  MAP.panTo(circle.getLatLng());
}