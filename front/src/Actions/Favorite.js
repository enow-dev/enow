import Cookies from 'universal-cookie';
import * as types from '../Constants/ActionTypes';

const cookies = new Cookies();

export const putFavorite = () => ({ type: types.PUT_FAVORITE });
export const putReceiveFavorite = event => ({ type: types.PUT_RECEIVE_FAVORITE, event });

export function putFavoriteIfNeed(eventId) {
  return (dispatch, getState) => {
    if (getState.isPutiing) {
      return Promise.resolve();
    }
    dispatch(putFavorite());
    const { REACT_APP_API_Scheme, REACT_APP_API_Host } = process.env;
    const url = `${REACT_APP_API_Scheme}${REACT_APP_API_Host}/api/events/${eventId}/favorites`;// eslint-disable-line
    const aouth = cookies.get('aouth');
    return fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.event+json', // eslint-disable-line
        'X-Authorization': `${aouth.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(() => dispatch(putReceiveFavorite({ id: eventId })))
      .catch((error) => {
        console.error(error);
      });
  };
}

export const deleteFavorite = eventId => ({ type: types.DELETE_FAVORITE, eventId });
export const deleteReceiveFavorite = result => ({ type: types.DELETE_RECEIVE_FAVORITE, result });
