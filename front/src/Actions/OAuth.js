import Cookies from 'universal-cookie';
import * as types from '../Constants/ActionTypes';
import MyAexios from '../Constants/MyAexios';

const cookies = new Cookies();

function setCookieOAuth(oauth) {
  cookies.remove('oauth', { path: '/' });
  cookies.set('oauth', oauth, { path: '/', expires: new Date(oauth.expire) });
  MyAexios.defaults.headers.common['X-Authorization'] = oauth.token;
}

export const startOAuth = () => ({ type: types.START_OAUTH });
export const redirectOAuth = () => ({ type: types.REDIRECT_OAUTH });

export const loginFromQookie = (oauth) => {
  MyAexios.defaults.headers.common['X-Authorization'] = oauth.token;
  return { type: types.LOGIN_FROM_QOOKIE, oauth };
};

export const POST_OAUTH = 'POST_OAUTH';
export const postOAuth = (code, provider) => {
  const config = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  return { type: POST_OAUTH, url: '/auth/login', data: { code, provider }, method: 'POST', headers: config };
};

export const login = {
  request: reqConfig => ({ type: types.OAUTH[types.REQUEST], reqConfig }),
  success: (response) => {
    setCookieOAuth(response);
    return { type: types.OAUTH[types.SUCCESS], response };
  },
  failure: error => ({ type: types.OAUTH[types.FAILURE], error }),
};

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

export function loginIfNeeded(code, provider) {
  return (dispatch, getState) => {
    const { oauth } = getState();
    if (oauth.isFetching || oauth.isError || oauth.isOAuth) {
      return Promise.resolve();
    }
    return dispatch(postOAuth(code, provider));
  };
}

export function checkOAuth() {
  return (dispatch, getState) => {
    if (getState().oauth.isOAuth) {
      return Promise.resolve();
    }
    if (getState().oauth.isRedirect) {
      return Promise.resolve();
    }
    const attr = getQueryString();
    if ('code' in attr) {
      dispatch(redirectOAuth());
      return dispatch(loginIfNeeded(attr.code, attr.provider));
    }
    // error
    return Promise.resolve();
  };
}

export function geusLogin() {
  const oauth = {
    avater_url: 'none',
    expire: '9999-99-99',
    name: 'ゲスト',
    token: 'guest',
  };
  setCookieOAuth(oauth);
  return dispatch => (dispatch({ type: types.GEUST_LOGIN, oauth }));
}

export function logout() {
  return (dispatch) => {
    cookies.remove('oauth', { path: '/' });
    dispatch({ type: types.LOGOUT });
    geusLogin();
  };
}

export function isCookieOAuth() {
  return (dispatch) => {
    const oauthCookie = cookies.get('oauth');
    if (oauthCookie === undefined) {
      // ゲストログイン
      geusLogin();
      return Promise.resolve();
    } else if (oauthCookie.token === 'guest') {
      return Promise.resolve();
    }
    return dispatch(loginFromQookie(oauthCookie));
  };
}

export function startOAuthGithub() {
  return (dispatch) => {
    const { REACT_APP_Github_ClientID, REACT_APP_API_Scheme, REACT_APP_FRONT_Host } = process.env;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${REACT_APP_Github_ClientID}&scope=user:email&redirect_uri=${REACT_APP_API_Scheme}${REACT_APP_FRONT_Host}/login?provider=github`;// eslint-disable-line
    return dispatch(startOAuth());
  };
}
export function startOauthFacebook() {
  return (dispatch) => {
    const { REACT_APP_Facebook_ClientID, REACT_APP_API_Scheme, REACT_APP_FRONT_Host } = process.env;
    window.location.href = `https://www.facebook.com/dialog/oauth?client_id=${REACT_APP_Facebook_ClientID}&redirect_uri=${REACT_APP_API_Scheme}${REACT_APP_FRONT_Host}/login/&response_type=code&scope=public_profile+email`;// eslint-disable-line
    return dispatch(startOAuth());
  };
}
