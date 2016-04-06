import { MAP, quakeLayer } from '../api';

const actions = {
  drawQuake: payload => ({ type: 'DRAW_QUAKE', payload })
};

export const drawQuake = quake => dispatch => {
  const [ lng, lat ] = quake.geometry.coordinates;
  const size = quake.properties.mag * 10000;
  const circle = L.circle([ lat, lng ], size).addTo(MAP);

  quakeLayer.addLayer(circle);
  dispatch(actions.drawQuake({
    quake,
    quakeCircle: quakeLayer.getLayerId(circle)
  }));
};

// function getRowFromEvent(event) {
//   return Rx.Observable
//     .fromEvent(table, event)
//     .filter(e => e.target.className === 'cell' && e.target.parentNode.id.length)
//     .pluck('target', 'parentNode')
//     .distinctUntilChanged();
// }

// getRowFromEvent('mouseover')
//   .pairwise()
//   .subscribe(rows => {
//     const [ prev, curr ] = rows;
//     const prevCircle = quakeLayer.getLayer(codeLayers[prev.id]);
//     const currCircle = quakeLayer.getLayer(codeLayers[curr.id]);

//     prevCircle.setStyle({ color: COLOR_PRIMARY });
//     currCircle.setStyle({ color: COLOR_HOVER });
//   });

// getRowFromEvent('click')
//   .subscribe(row => {
//      const circle = quakeLayer.getLayer(codeLayers[row.id]);

//      MAP.panTo(circle.getLatLng());
//   });