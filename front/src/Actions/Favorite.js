import * as types from '../Constants/ActionTypes';

export const DELETE_FAVORITE = 'DELETE_FAVORITE';
export const PUT_FAVORITE = 'PUT_FAVORITE';

export const deleteFavorite = eventId => ({ type: DELETE_FAVORITE, url: `/events/${eventId}/favorites`, method: 'DELETE' });
export const putFavorite = eventId => ({ type: PUT_FAVORITE, url: `/events/${eventId}/favorites`, method: 'PUT' });

export const favorite = {
  request: url => ({ type: types.FAVORITE[types.REQUEST], url }),
  success: response => ({ type: types.FAVORITE[types.SUCCESS], response }),
  failure: error => ({ type: types.FAVORITE[types.FAILURE], error }),
};

export function putFavoriteIfNeed(eventId) {
  return (dispatch, getState) => {
    if (getState.isPutiing) {
      return Promise.resolve();
    }
    return dispatch(putFavorite(eventId));
  };
}
export function deleteFavoriteIfNeed(eventId) {
  return (dispatch, getState) => {
    if (getState.deleting) {
      return Promise.resolve();
    }
    return dispatch(deleteFavorite(eventId))
  };
}
