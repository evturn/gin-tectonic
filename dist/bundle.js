(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('leaflet'), require('rx')) :
  typeof define === 'function' && define.amd ? define(['leaflet', 'rx'], factory) :
  (factory(global.L,global.rx));
}(this, function (L,rx) { 'use strict';

  L = 'default' in L ? L['default'] : L;

  var map = L.map('map').setView([33.858631, -118.279602], 7);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  console.log('me like the way you work it. no diggity.');

}));