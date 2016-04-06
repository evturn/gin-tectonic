import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { MAP, req } from './api';
import App from './components/App';
import configureStore from './store';

const quakes = Rx.Observable
  .interval(5000)
  .flatMap(() => Rx.DOM.jsonpRequest(req).retry(3))
  .flatMap(result => Rx.Observable.from(result.response.features))
  .distinct(quake => quake.properties.code)
  .share();

const initialState = configureStore({
  quake: {
    quakes: quakes
  }
});

render(
  <Provider store={initialState}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// Rx.DOM.ready().subscribe(initialize);