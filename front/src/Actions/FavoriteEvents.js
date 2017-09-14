import Cookies from 'universal-cookie';
import parse from 'parse-link-header';
import * as types from '../Constants/ActionTypes';

const cookies = new Cookies();

export const receiveFavoriteEvents = (events, isEnd, link) => (
  { type: types.RECEIVE_EVENTS, events, link }
);
export const fetchFavoriteEvents = () => ({ type: types.FETCH_EVENTS });

function getFavoriteEvents(isEnd, link) {
  const { REACT_APP_API_Scheme, REACT_APP_API_Host } = process.env;
  let url = `${REACT_APP_API_Scheme}${REACT_APP_API_Host}/api/events/self/favorites?isEnd=${isEnd}`;// eslint-disable-line
  if (link) {
    url = link.next.url;
  }
  return (dispatch) => {
    dispatch(fetchFavoriteEvents());
    const aouth = cookies.get('aouth');
    let responseLink = '';
    return fetch(url, {
      mode: 'cors',
      method: 'GET',
      header: {
        Accept: 'application/vnd.event+json', // eslint-disable-line
        'X-Authorization': `${aouth.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        responseLink = parse(response.headers.get('Link'));
        return response.json();
      })
      .then(responseJson => dispatch(receiveFavoriteEvents(responseJson, isEnd, responseLink)));
  };
}

export function getFavoriteEventsIfNeeded(isEnd) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getFavoriteEvents(isEnd));
  };
}
