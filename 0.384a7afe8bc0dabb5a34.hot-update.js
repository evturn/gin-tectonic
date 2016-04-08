webpackHotUpdate(0,{

/***/ 77:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _api = __webpack_require__(78);

	var _rx = __webpack_require__(79);

	var _rxDom = __webpack_require__(80);

	var _constants = __webpack_require__(81);

	__webpack_require__(82);

	var codeLayers = {};
	var table = document.getElementById('data-list');
	var header = document.getElementById('data-header');

	function initialize() {
	  var socket = _rxDom.DOM.fromWebSocket('ws://127.0.0.1:8080');

	  var quakes = _rx.Observable.interval(5000).flatMap(function () {
	    return _rxDom.DOM.jsonpRequest(_api.req).retry(3);
	  }).flatMap(function (result) {
	    return _rx.Observable.from(result.response.features);
	  }).distinct(function (quake) {
	    return quake.properties.code;
	  }).share();

	  quakes.subscribe(renderQuakes);

	  quakes.bufferWithCount(100).subscribe(function (quakes) {
	    var quakesData = quakes.map(function (quake) {
	      var _quake$properties = quake.properties;
	      var net = _quake$properties.net;
	      var code = _quake$properties.code;
	      var mag = _quake$properties.mag;

	      var _quake$geometry$coord = _slicedToArray(quake.geometry.coordinates, 2);

	      var lng = _quake$geometry$coord[0];
	      var lat = _quake$geometry$coord[1];


	      var id = net + code;

	      return { id: id, lat: lat, lng: lng, mag: mag };
	    });

	    socket.onNext(JSON.stringify({ quakes: quakesData }));
	  });

	  socket.map(function (message) {
	    return JSON.parse(message.data);
	  }).subscribe(function (data) {
	    var container = document.getElementById('twitter');

	    container.insertBefore(renderTweet(data), container.firstChild);
	  });

	  getRowFromEvent('mouseover').pairwise().subscribe(onHoverHighlightMapQuake);

	  getRowFromEvent('click').subscribe(onClickPanToQuake);

	  getColumnFromEvent('click').subscribe(function (e) {
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

	  quakes.pluck('properties').map(renderRows).subscribe(function (row) {
	    return table.appendChild(row);
	  });
	}

	_rxDom.DOM.ready().subscribe(initialize);

	function renderRows(props) {
	  var net = props.net;
	  var code = props.code;
	  var place = props.place;
	  var mag = props.mag;
	  var time = props.time;

	  var date = new Date(time);
	  var columns = [place, mag, date.toString()];
	  var row = document.createElement('ul');

	  row.id = net + code;
	  row.className = 'row';

	  columns.forEach(function (text) {
	    var cell = document.createElement('li');

	    cell.className = 'cell';
	    cell.textContent = text;
	    row.appendChild(cell);
	  });

	  return row;
	}

	function renderTweet(tweetObj) {
	  var avatar = tweetObj.avatar;
	  var text = tweetObj.text;
	  var date = tweetObj.date;
	  var time = tweetObj.time;
	  var name = tweetObj.name;

	  var content = '\n    <div class="details">\n      <img class="avatar" src="' + avatar + '" />\n      <div class="text">' + text + '</div>\n    </div>\n    <div class="date">\n      <div class="name">@' + name + '</div>\n      <div class="day">' + date + '</div>\n      <div class="time">' + time + '</div>\n    </div>\n  ';
	  var div = document.createElement('div');

	  div.className = 'tweet';
	  div.innerHTML = content;
	  return div;
	}

	function renderQuakes(quake) {
	  var _quake$geometry$coord2 = _slicedToArray(quake.geometry.coordinates, 2);

	  var lng = _quake$geometry$coord2[0];
	  var lat = _quake$geometry$coord2[1];

	  var size = quake.properties.mag * 10000;
	  var circle = L.circle([lat, lng], size).addTo(_api.MAP);

	  _api.quakeLayer.addLayer(circle);
	  codeLayers[quake.id] = _api.quakeLayer.getLayerId(circle);
	}

	function getRowFromEvent(event) {
	  return _rx.Observable.fromEvent(table, event).filter(function (e) {
	    return e.target.className === 'cell' && e.target.parentNode.id.length;
	  }).pluck('target', 'parentNode').distinctUntilChanged();
	}

	function getColumnFromEvent(event) {
	  return _rx.Observable.fromEvent(header, event);
	}

	function onHoverHighlightMapQuake(rows) {
	  var _rows = _slicedToArray(rows, 2);

	  var prev = _rows[0];
	  var curr = _rows[1];

	  var prevCircle = _api.quakeLayer.getLayer(codeLayers[prev.id]);
	  var currCircle = _api.quakeLayer.getLayer(codeLayers[curr.id]);

	  prevCircle.setStyle({ color: _constants.COLOR_PRIMARY });
	  currCircle.setStyle({ color: _constants.COLOR_HOVER });
	}

	function onClickPanToQuake(row) {
	  var circle = _api.quakeLayer.getLayer(codeLayers[row.id]);

	  _api.MAP.panTo(circle.getLatLng());
	}

/***/ },

/***/ 82:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

})