import * as types from '../Constants/ActionTypes'

export const GET_EVENTS_COUNT = 'GET_EVENT_COUNT';
export const eventsCount = {
  request: reqConfig => ({ type: types.EVENTS_COUNT[types.REQUEST], reqConfig }),
  success: response => ({ type: types.EVENTS_COUNT[types.SUCCESS], response }),
  failure: error => ({ type: types.EVENTS_COUNT[types.FAILURE], error }),
};

export const getEventsCount = (pref, q) => ({ type: GET_EVENTS_COUNT, url: '/events/count', params: { pref, q } });

export function getEventsCountIfNeeded(pref, q) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEventsCount(pref, q));
  };
}
