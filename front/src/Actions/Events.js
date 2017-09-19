import Cookies from 'universal-cookie';
import parse from 'parse-link-header';
import * as types from '../Constants/ActionTypes';

const cookies = new Cookies();

export const receiveEvents = (events, isMoreRead, link) => (
  { type: types.RECEIVE_EVENTS, events, isMoreRead, link }
);
export const fetchEvents = isMoreRead => ({ type: types.FETCH_EVENTS, isMoreRead });
export const clearEvents = () => ({ type: types.CLEAR_EVENTS });

function getEvents(isFavorite, isRed, isMoreRead, q, pref, link, startDate, endDate) {
  const { REACT_APP_API_Scheme, REACT_APP_API_Host } = process.env;
  let url = `${REACT_APP_API_Scheme}${REACT_APP_API_Host}/api/events?` +// eslint-disable-line
            `is_favorite=${isFavorite}` +
            `&is_red=${isRed}` +
            `${q ? `&q=${q}` : ''}` +
            `${pref > 0 ? `&pref=${pref}` : ''}` +
            `${endDate && endDate !== '' ? `&period_to=${endDate}` : ''}` +
            `${startDate && startDate !== '' ? `&period_from=${startDate}` : ''}`;
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

export function getEventsIfNeeded(isFavorite, isRed, q, pref, startDate, endDate) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvents(isFavorite, isRed, false, q, pref, false, startDate, endDate));
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
