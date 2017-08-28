import dotenv from 'dotenv';
import * as types from '../Constants/ActionTypes';

dotenv.config();

export const receiveEvent = events => ({ type: types.RECEIVE_EVENT, events });
export const fetchEvent = () => ({ type: types.FETCH_EVENT });

function getEvent(isFavorite, isRed) {
  // const url = `http://localhost:8080/api/events?is_favorite=${isFavorite}&is_red=${isRed}`;

  let scheme = process.env.REACT_APP_API_Scheme;
  if (scheme == null) {
    scheme = process.env.Scheme;
  }
  let host = process.env.REACT_APP_API_Host;
  if (host == null) {
    host = process.env.Host;
  }
  const url = `${scheme}${host}/api/events?is_favorite=${isFavorite}&is_red=${isRed}`;
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
      .then(response => response.json())
      .then(responseJson => dispatch(receiveEvent(responseJson)));
  };
}

export function getEventsIfNeeded(isFavorite, isRed) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getEvent(isFavorite, isRed));
  };
}
