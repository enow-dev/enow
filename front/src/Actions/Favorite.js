import * as types from '../Constants/ActionTypes';
import MyAexios from '../Constants/MyAexios';

export const putFavorite = () => ({ type: types.PUT_FAVORITE });
export const putReceiveFavorite = event => ({ type: types.PUT_RECEIVE_FAVORITE, event });

export function putFavoriteIfNeed(event) {
  return (dispatch, getState) => {
    if (getState.isPutiing) {
      return Promise.resolve();
    }
    dispatch(putFavorite());
    MyAexios.put(`/events/${event.item.id}/favorites`)
      .then(() => {
        dispatch(putReceiveFavorite(event));
      });
  };
}

export const deleteFavorite = () => ({ type: types.DELETE_FAVORITE });
export const deleteReceiveFavorite = event => ({ type: types.DELETE_RECEIVE_FAVORITE, event });

export function deleteFavoriteIfNeed(event) {
  return (dispatch, getState) => {
    if (getState.deleting) {
      return Promise.resolve();
    }
    dispatch(putFavorite());
    MyAexios.delete(`/events/${event.item.id}/favorites`)
      .then(() => {
        dispatch(putReceiveFavorite(event));
      });
  };
}
