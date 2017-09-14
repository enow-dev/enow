import Cookies from 'universal-cookie';
import * as types from '../Constants/ActionTypes';

const cookies = new Cookies();

export const receiveEventsCount = count => ({ type: types.RECEIVE_EVENTS_COUNT, count });
export const fetchEventsCount = () => ({ type: types.FETCH_EVENTS_COUNT });

function getEventsCount(pref, q) {
  const { REACT_APP_API_Scheme, REACT_APP_API_Host } = process.env;
  let url = `${REACT_APP_API_Scheme}${REACT_APP_API_Host}/api/events/count?${q ? `&q=${q}` : ''}${pref > 0 ? `&pref=${pref}` : ''}`;// eslint-disable-line
  return (dispatch) => {
    dispatch(fetchEventsCount());
    const aouth = cookies.get('aouth');
    return fetch(url, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Accept: 'application/vnd.event+json', // eslint-disable-line
        'X-Authorization': `${aouth.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => dispatch(receiveEventsCount(responseJson)));
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
