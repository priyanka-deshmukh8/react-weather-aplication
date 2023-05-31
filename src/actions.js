import fetch from 'cross-fetch';
import encodeForYahoo from './common/encodeForYahoo';

export const SELECT_CITY = 'SLECT CITY';
export const REQUEST_FORECASTS = 'REQUEST FORECASTS';
export const RECEIVE_FORECASTS = 'RECEIVE FORCASTS';
export const INVALIDATE_CITY = 'INVALIDATE CITY';

export function selectCity(city) {
  return {
    type: SELECT_CITY,
    city,
  };
}

export function invalidateCity(city) {
  return {
    type: INVALIDATE_CITY,
    city,
  };
}

function requestForecasts(city) {
  return {
    type: REQUEST_FORECASTS,
    city,
  };
}

function receiveForecasts(city, json) {
  console.log(json.query.results.channel.item.forecast);
  return {
    type: RECEIVE_FORECASTS,
    city,
    forecasts: json.query.results.channel.item.forecast,
    receivedAt: Date.now(),
  };
}

function fetchForecasts(city) {
  return (dispatch) => {
    dispatch(requestForecasts(city));
    return fetch(encodeForYahoo(city))
      .then((response) => response.json())
      .then((json) => dispatch(receiveForecasts(city, json)));
  };
}

function shouldFetchForecasts(state, city) {
  const forecasts = state.forecastsByCity[city];
  if (!forecasts) {
    return true;
  } else if (forecasts.isFetching) {
    return false;
  } else {
    return forecasts.didInvalidate;
  }
}

export function fetchForecastsIfNeeded(city) {
  return (dispatch, getState) => {
    if (shouldFetchForecasts(getState(), city)) {
      return dispatch(fetchForecasts(city));
    }
  };
}
