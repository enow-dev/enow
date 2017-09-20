import * as types from '../Constants/ActionTypes'
import MyAexios from '../Constants/MyAexios';

export const receiveEventsCount = count => ({ type: types.RECEIVE_EVENTS_COUNT, count });
export const fetchEventsCount = () => ({ type: types.FETCH_EVENTS_COUNT });

function getEventsCount(pref, q) {
  return (dispatch) => {
    dispatch(fetchEventsCount());
    const params = new URLSearchParams();
    if (q) { params.append('q', q); }
    if (pref > 0) { params.append('pref', pref); }

    MyAexios.get('events/count', {
      params,
    })
      .then((response) => {
        dispatch(receiveEventsCount(response.data));
      });
  };
}

export function getEventsCountIfNeeded(pref, q) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEventsCount(pref, q));
  };
}
