import * as types from '../Constants/ActionTypes';
import MyAexios from '../Constants/MyAexios';

export const receiveEvent = event => (
  { type: types.RECEIVE_EVENT, event }
);
export const fetchEvent = () => ({ type: types.FETCH_EVENT });

function getEvent(eventId) {
  return (dispatch) => {
    dispatch(fetchEvent());
    MyAexios.get(`events/${eventId}`, {
      mode: 'cors',
      responseType: 'json',
    })
      .then((response) => {
        if (response.status !== 200) {
          dispatch({ type: types.ADD_ERROR, error: response });
        }
        dispatch(receiveEvent({ item: response.data }));
      });
  };
}

export function getEventIfNeeded(eventId) {
  return (dispatch, getState) => {
    if (getState().events.isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvent(eventId));
  };
}
