import Cookies from 'universal-cookie';
import * as types from '../Constants/ActionTypes';
import getUrl from '../Utils/UrlScheme';
import getGithubID from '../Utils/AouthClientID';

const cookies = new Cookies();

function setCookieAouth(aouth) {
  cookies.remove('aouth', { path: '/' });
  cookies.set('aouth', aouth, { path: '/', expires: new Date(aouth.expire) });
}

export const startAouth = () => ({ type: types.START_AOUTH });
export const redirectAouth = () => ({ type: types.REDIRECT_AOUTH });
export const fetchLogin = () => ({ type: types.FETCH_LOGIN });

export function receiveLogin(aouth) {
  return (dispatch) => {
    setCookieAouth(aouth);
    return dispatch({ type: types.RECEIVE_LOGIN, aouth });
  };
}

export const loginFromQookie = aouth => (
  { type: types.LOGIN_FROM_QOOKIE, aouth }
);
export const logout = () => ({ type: types.LOGOUT });
function login(code) {
  const url = `${getUrl()}/auth/login?code=${code}`;
  return (dispatch) => {
    dispatch(fetchLogin());
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.event+json', // eslint-disable-line
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          dispatch({ type: types.LOGIN_ERROR, error: response });
        }
        return response.json();
      })
      .then(responseJson => dispatch(receiveLogin(responseJson)));
  };
}

function getQueryString() {
  const result = {};
  if (window.location.search.length > 1) {
    const query = window.location.search.substring(1);
    const parameters = query.split('&');
    for (let i = 0; i < parameters.length; i += 1) {
      const element = parameters[i].split('=');
      const paramName = decodeURIComponent(element[0]);
      const paramValue = decodeURIComponent(element[1]);
      result[paramName] = paramValue;
    }
  }
  return result;
}

export function loginIfNeeded(code) {
  return (dispatch, getState) => {
    const { aouth } = getState();
    if (aouth.isFetching || aouth.isError || aouth.isAouth) {
      return Promise.resolve();
    }
    return dispatch(login(code));
  };
}

export function checkAouth() {
  return (dispatch, getState) => {
    if (getState().aouth.isAouth) {
      return Promise.resolve();
    }
    if (getState().aouth.isRedirect) {
      return Promise.resolve();
    }
    const attr = getQueryString();
    if ('code' in attr) {
      dispatch(redirectAouth());
      return dispatch(loginIfNeeded(attr.code));
    }
    // error
    return Promise.resolve();
  };
}

export function isCookieAouth() {
  return (dispatch) => {
    const aouthCookie = cookies.get('aouth');
    if (aouthCookie === undefined) {
      return Promise.resolve();
    }
    return dispatch(loginFromQookie(aouthCookie));
  };
}
export function startAouthGithub() {
  return (dispatch) => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${getGithubID()}&scope=user:email&redirect_uri=${getUrl()}/login`;
    return dispatch(startAouth());
  };
}
