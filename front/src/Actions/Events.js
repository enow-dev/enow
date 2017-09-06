import Cookies from 'universal-cookie';
import * as types from '../Constants/ActionTypes';

const cookies = new Cookies();

export const receiveEvents = (events, isMoreRead) => (
  { type: types.RECEIVE_EVENTS, events, isMoreRead }
);
export const fetchEvents = isMoreRead => ({ type: types.FETCH_EVENTS, isMoreRead });

function getEvents(isFavorite, isRed, isMoreRead, q, pref) {
  const { REACT_APP_API_Scheme, REACT_APP_API_Host } = process.env;
  const url = `${REACT_APP_API_Scheme}${REACT_APP_API_Host}/api/events?is_favorite=${isFavorite}&is_red=${isRed}${q ? `&q=${q}` : ''}${pref > 0 ? `&pref=${pref}` : ''}`;// eslint-disable-line
  return (dispatch) => {
    dispatch(fetchEvents(isMoreRead));
    const aouth = cookies.get('aouth');
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.event+json', // eslint-disable-line
        'X-Authorization': `${aouth.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => dispatch(receiveEvents(responseJson, isMoreRead)));
  };
}

export function getEventsIfNeeded(isFavorite, isRed, q, pref) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvents(isFavorite, isRed, false, q, pref));
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
