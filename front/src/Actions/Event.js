import * as types from '../Constants/ActionTypes';

export const receiveEvent = (event) => (
  { type: types.RECEIVE_EVENT, event }
);
export const fetchEvent = () => ({ type: types.FETCH_EVENT });

function getEvent(eventId) {
  let scheme = process.env.REACT_APP_API_Scheme;
  if (scheme == null) {
    scheme = process.env.Scheme;
  }
  let host = process.env.REACT_APP_API_Host;
  if (host == null) {
    host = process.env.Host;
  }
  const url = `${scheme}${host}/api/events/${eventId}`;
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
      .then(response => {
        if(response.status !== 200){
          dispatch({type: types.ADD_ERROR, error: response});
        }
        return response.json();
      })
      .then(responseJson => dispatch(receiveEvent(responseJson)));
  };
}

export function getEventIfNeeded(eventId) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvent(eventId));
  };
}
