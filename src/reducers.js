import {combineReducers} from 'redux';
import {
  SELECT_CITY,
  REQUEST_FORECASTS,
  RECEIVE_FORECASTS,
  INVALIDATE_CITY,
} from './actions';

function selectedCity(state = 'Durham, NC', action) {
  switch (action.type) {
    case SELECT_CITY:
      return action.city;
    default:
      return state;
  }
}

function forecasts(
  state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
  },
  action
) {
  switch (action.type) {
    case REQUEST_FORECASTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
      });
    case RECEIVE_FORECASTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.forecasts,
        lastUpdated: action.receivedAt,
      });
    case INVALIDATE_CITY:
      return Object.assign({}, state, {
        didInvalidate: true,
      });
    default:
      return state;
  }
}

function forecastsByCity(state = {}, action) {
  switch (action.type) {
    case REQUEST_FORECASTS:
    case RECEIVE_FORECASTS:
    case INVALIDATE_CITY:
      return Object.assign({}, state, {
        [action.city]: forecasts(state[action.city], action),
      });
    default:
      return state;
  }
}

export default combineReducers({
  selectedCity,
  forecastsByCity,
});
