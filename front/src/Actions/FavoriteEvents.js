import parse from 'parse-link-header';
import * as types from '../Constants/ActionTypes';
import MyAexios from '../Constants/MyAexios';

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
    let responseLink = '';
    const params = new URLSearchParams();
    params.append('isEnd', isEnd);
    MyAexios.get('/events/self/favorites', {
      params,
    })
      .then((response) => {
        responseLink = parse(response.headers.link);
        dispatch(receiveFavoriteEvents(response.data, isEnd, responseLink));
      })
      .catch((error) => {
        console.log(error);
      });
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
