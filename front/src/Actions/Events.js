import parse from 'parse-link-header';
import * as types from '../Constants/ActionTypes';
import MyAexios from '../Constants/MyAexios';


export const receiveEvents = (events, isMoreRead, link) => (
  { type: types.RECEIVE_EVENTS, events, isMoreRead, link }
);
export const fetchEvents = isMoreRead => ({ type: types.FETCH_EVENTS, isMoreRead });
export const clearEvents = () => ({ type: types.CLEAR_EVENTS });

function getEvents(isFavorite, isRed, isMoreRead, q, pref, link = '', startDate, endDate) {
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

    MyAexios.get(`${!link || link === '' ? '/events' : `${link.next.url}`}`, {
      params,
    })
      .then((response) => {
        responseLink = parse(response.headers.link);
        dispatch(receiveEvents(response.data, isMoreRead, responseLink));
      })
      .catch((error) => {
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
