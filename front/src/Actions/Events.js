import * as types from '../Constants/ActionTypes';

export const GET_EVENTS = 'GET_EVENTS';
export const NAVIGATE = 'NAVIGATE';

function action(type, payload = {}) {
  return { type, ...payload };
}

export const events = {
  request: (url, params) => (action(types.EVENTS[types.REQUEST], { url, params })),
  success: response => (action(types.EVENTS[types.SUCCESS], { response })),
  failure: error => action(types.EVENTS[types.FAILURE], { error }),
};

export const getEvents = (url, params) => action(GET_EVENTS, { url, params });

export const clearEvents = () => ({ type: types.CLEAR_EVENTS });


export function getEventsIfNeeded(url, params) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvents(url, params));
  };
}

export function moreReadEventsIfNeeded(url) {
  return (dispatch, getState) => {
    if (getState().isMoreFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvents(url));
  };
}
