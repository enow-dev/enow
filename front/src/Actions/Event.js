import * as types from '../Constants/ActionTypes';

export const receiveEvent = event => (
  { type: types.RECEIVE_EVENT, event }
);
export const fetchEvent = () => ({ type: types.FETCH_EVENT });

function getEvent(eventId) {
  const { REACT_APP_API_Scheme, REACT_APP_API_Host } = process.env;
  const url = `${REACT_APP_API_Scheme}${REACT_APP_API_Host}/api/events/${eventId}`;// eslint-disable-line
  return (dispatch) => {
    dispatch(fetchEvent());
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.event+json', // eslint-disable-line
        'X-Authorization': 'hogehoge',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          dispatch({ type: types.ADD_ERROR, error: response });
        }
        return response.json();
      })
      .then(responseJson => dispatch(receiveEvent(responseJson)));
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
