console.log('me like the way you work it. no diggity.')

export const MAP = L.map('map').setView([33.858631, -118.279602], 7);
export const req = {
  url: 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp',
  jsonpCallback: 'eqfeed_callback'
};

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(MAP);