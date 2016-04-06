(function () {
  'use strict';

  console.log('me like the way you work it. no diggity.')

  const map = L.map('map').setView([33.858631, -118.279602], 7);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  const req = {
    url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/' + 'summary/all_day.geojsonp',
    jsonpCallback: 'eqfeed_callback'
  };
  const COLOR_PRIMARY ='#0000ff';
  const COLOR_HOVER = '#ff0000';
  const codeLayers = {};
  const quakeLayer = L.layerGroup([]).addTo(map);
  const identity = Rx.helpers.identity;

  function isHovering(element) {
    const over = Rx.DOM.mouseover(element).map(identity(true));
    const out = Rx.DOM.mouseout(element).map(identity(false));

    return over.merge(out);
  }

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
      const circle = L.circle([ lat, lng ], size).addTo(map);

      quakeLayer.addLayer(circle);
      codeLayers[quake.id] = quakeLayer.getLayerId(circle);
    });

    const table = document.getElementById('quakes_info');
    const overlay = document.getElementsByClassName('leaflet-zoom-animated');

    quakes
      .pluck('properties')
      .map(makeRow)
      .bufferWithTime(500)
      .filter(rows => rows.length > 0)
      .map(rows => {
        const fragment = document.createDocumentFragment();

        rows.forEach(row => fragment.appendChild(row));

        return { rows, fragment };
      })
      .subscribe(
        props => {


          props.rows.forEach(row => {
            const circle = quakeLayer.getLayer(codeLayers[row.id]);

            isHovering(row)
              .subscribe(hovering => {
                console.log(hovering);
                circle.setStyle({
                  color: hovering ? COLOR_HOVER : COLOR_PRIMARY
                })
              });


            Rx.DOM.click(row).subscribe(
              () => {
                console.log('Clickity');
                map.panTo(circle.getLatLng())
              }
            );
          })

          table.appendChild(props.fragment);
        }
      );
  }

  Rx.DOM.ready().subscribe(initialize);

}());