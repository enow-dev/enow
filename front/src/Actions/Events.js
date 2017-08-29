import * as types from '../Constants/ActionTypes';

export const receiveEvents = (events, isMoreRead) => (
  { type: types.RECEIVE_EVENTS, events, isMoreRead }
);
export const fetchEvents = isMoreRead => ({ type: types.FETCH_EVENTS, isMoreRead });

function getEvents(isFavorite, isRed, isMoreRead) {
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
    dispatch(fetchEvents(isMoreRead));
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.event+json', // eslint-disable-line
        'X-Authorization': 'hogehoge',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => dispatch(receiveEvents(responseJson, isMoreRead)));
  };
}

export function getEventsIfNeeded(isFavorite, isRed) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvents(isFavorite, isRed, false));
  };
}

export function moreReadEventsIfNeeded(isFavorite, isRed) {
  return (dispatch, getState) => {
    if (getState().isMoreFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvents(isFavorite, isRed, true));
  };
}
