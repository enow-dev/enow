import Cookies from 'universal-cookie';
import parse from 'parse-link-header';
import * as types from '../Constants/ActionTypes';

const cookies = new Cookies();

export const receiveEvents = (events, isMoreRead, link) => (
  { type: types.RECEIVE_EVENTS, events, isMoreRead, link }
);
export const fetchEvents = isMoreRead => ({ type: types.FETCH_EVENTS, isMoreRead });

function getEvents(isFavorite, isRed, isMoreRead, q, pref, link) {
  const { REACT_APP_API_Scheme, REACT_APP_API_Host } = process.env;
  let url = `${REACT_APP_API_Scheme}${REACT_APP_API_Host}/api/events?is_favorite=${isFavorite}&is_red=${isRed}${q ? `&q=${q}` : ''}${pref > 0 ? `&pref=${pref}` : ''}`;// eslint-disable-line
  if (link) {
    url = link.next.url;
  }
  return (dispatch) => {
    dispatch(fetchEvents(isMoreRead));
    const aouth = cookies.get('aouth');
    let responseLink = '';
    return fetch(url, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Accept: 'application/vnd.event+json', // eslint-disable-line
        'X-Authorization': `${aouth.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        responseLink = parse(response.headers.get('Link'));
        return response.json();
      })
      .then(responseJson => dispatch(receiveEvents(responseJson, isMoreRead, responseLink)));
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

export function moreReadEventsIfNeeded(isFavorite, isRed, link) {
  return (dispatch, getState) => {
    if (getState().isMoreFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvents(isFavorite, isRed, true, '', 0, link));
  };
}
