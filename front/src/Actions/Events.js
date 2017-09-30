import * as types from '../Constants/ActionTypes';

export const GET_EVENTS = 'GET_EVENTS';
export const NAVIGATE = 'NAVIGATE';

function action(type, payload = {}) {
  return { type, ...payload };
}

export const events = {
  request: (
    isFavorite,
    isRed,
    isMoreRead,
    q,
    pref,
    startDate,
    endDate,
    url,
  ) => {
    const params = new URLSearchParams();
    params.append('is_favorite', isFavorite);
    params.append('is_red', isRed);
    if (q) { params.append('q', q); }
    if (pref > 0) { params.append('pref', pref); }
    if (endDate && endDate !== '') { params.append('period_to', endDate); }
    if (startDate && startDate !== '') { params.append('period_from', startDate); }
    return action(types.EVENTS[types.REQUEST], {
      url,
      params,
    });
  },
  success: response => (action(types.EVENTS[types.SUCCESS], { response })),
  failure: error => action(types.EVENTS[types.FAILURE], { error }),
};

export const getEvents = (
  isFavorite,
  isRed,
  isMoreRead,
  q,
  pref,
  startDate,
  endDate,
  link = false,
  requiredFields = [],
) => action(GET_EVENTS, {
  isFavorite,
  isRed,
  isMoreRead,
  q,
  pref,
  startDate,
  endDate,
  requiredFields,
  url: `${!link || link === '' ? '/events' : `${link.next.url}`}`,
});

export const clearEvents = () => ({ type: types.CLEAR_EVENTS });


export function getEventsIfNeeded(isFavorite, isRed, q, pref, startDate, endDate) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvents(isFavorite, isRed, false, q, pref, startDate, endDate));
  };
}

export function moreReadEventsIfNeeded(isFavorite, isRed, link) {
  return (dispatch, getState) => {
    if (getState().isMoreFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvents(isFavorite, isRed, true, '', 0, '', '', link));
  };
}
