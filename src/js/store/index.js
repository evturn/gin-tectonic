import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import quake from '../reducers';
import logger from 'redux-logger';

const rootReducer = combineReducers({ quake });

const thunkmasterFlex = ({ dispatch, getState }) => {
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    return next(action);
  };
};

const middleware = compose(
  applyMiddleware(thunkmasterFlex, logger())
);

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, middleware);
}