import * as types from '../Constants/ActionTypes';

export const GET_EVENT = 'GET_EVENT';

export const event = {
  request: url => ({ type: types.EVENT[types.REQUEST], url }),
  success: response => ({ type: types.EVENT[types.SUCCESS], response }),
  failure: error => ({ type: types.EVENT[types.FAILURE], error }),
};

export const getEvent = eventId => ({ type: GET_EVENT, url: `/events/${eventId}` });

export function getEventIfNeeded(eventId) {
  return (dispatch, getState) => {
    if (getState().events.isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvent(eventId));
  };
}
