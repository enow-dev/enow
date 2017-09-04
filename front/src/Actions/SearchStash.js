import * as types from '../Constants/ActionTypes';

export const clearSearchStash = () => (
  { type: types.CLEAR_SEARCH }
);

export const setSearchStash = search => (
  { type: types.SET_SEARCH, search }
);
