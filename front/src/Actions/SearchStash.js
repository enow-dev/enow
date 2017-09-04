import Cookies from 'universal-cookie';

import * as types from '../Constants/ActionTypes';

const cookies = new Cookies();
const ST_KEY = 'search_stash';

export const clearSearchStash = (dispatch) => {
  cookies.remove(ST_KEY, { path: '/' });
  return dispatch({ type: types.CLEAR_SEARCH });
};

export function setSearchStash(search) {
  cookies.remove(ST_KEY, { path: '/' });
  const expireDate = new Date();
  expireDate.setDate(expireDate + 1);
  cookies.set(ST_KEY, search, { path: '/', expire: expireDate });
  return dispatch => (dispatch({ type: types.SET_SEARCH, search }));
}

export function isCookieST() {
  return (dispatch) => {
    const cookieST = cookies.get(ST_KEY);
    if (cookieST === undefined) {
      return Promise.resolve();
    }
    return dispatch(setSearchStash(cookieST));
  };
}
