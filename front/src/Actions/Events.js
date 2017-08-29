import * as types from '../Constants/ActionTypes';

export const receiveEvent = (events, isMoreRead) => (
  { type: types.RECEIVE_EVENT, events, isMoreRead }
);
export const fetchEvent = isMoreRead => ({ type: types.FETCH_EVENT, isMoreRead });

function getEvent(isFavorite, isRed, isMoreRead) {
  // const url = `http://localhost:8080/api/events?is_favorite=${isFavorite}&is_red=${isRed}`;

  let scheme = process.env.REACT_APP_API_Scheme;
  if (scheme == null) {
    scheme = process.env.Scheme;
  }
  let host = process.env.REACT_APP_API_Host;
  if (host == null) {
    host = process.env.Host;
  }
  const url = `${scheme}${host}/api/events?is_favorite=${isFavorite}&is_red=${isRed}`;
  return (dispatch) => {
    dispatch(fetchEvent(isMoreRead));
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.event+json', // eslint-disable-line
        'X-Authorization': 'hogehoge',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => dispatch(receiveEvent(responseJson, isMoreRead)));
  };
}

export function getEventsIfNeeded(isFavorite, isRed) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvent(isFavorite, isRed, false));
  };
}

export function moreReadEventIfNeeded(isFavorite, isRed) {
  return (dispatch, getState) => {
    if (getState().isMoreFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvent(isFavorite, isRed, true));
  };
}
