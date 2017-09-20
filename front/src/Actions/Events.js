import parse from 'parse-link-header';
import * as types from '../Constants/ActionTypes';
import MyAexios from '../Constants/MyAexios';


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
    let responseLink = '';
    const params = new URLSearchParams();
    params.append('is_favorite', isFavorite);
    params.append('is_red', isRed);
    if (q) { params.append('q', q); }
    if (pref > 0) { params.append('pref', pref); }
    if (endDate && endDate !== '') { params.append('period_to', endDate); }
    if (startDate && startDate !== '') { params.append('period_from', startDate); }
    MyAexios.get('/events', {
      mode: 'cors',
      params,
      responseType: 'json',
    })
      .then((response) => {
        responseLink = parse(response.headers.link);
        dispatch(receiveEvents(response.data, isMoreRead, responseLink));
      })
      .catch(function (error) {
        console.log(error);
      });
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
