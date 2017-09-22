import Cookies from 'universal-cookie';
import * as types from '../Constants/ActionTypes';
import MyAexios from '../Constants/MyAexios';

const cookies = new Cookies();

function setCookieAouth(aouth) {
  cookies.remove('aouth', { path: '/' });
  cookies.set('aouth', aouth, { path: '/', expires: new Date(aouth.expire) });
  MyAexios.defaults.headers.common['X-Authorization'] = aouth.token;
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

function login(code, provider) {
  const { REACT_APP_API_Scheme, REACT_APP_API_Host } = process.env;
  const url = `${REACT_APP_API_Scheme}${REACT_APP_API_Host}/api/auth/login`;// eslint-disable-line
  return (dispatch) => {
    dispatch(fetchLogin());
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('provider', provider);
    MyAexios.post('/aouth/login', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params,
    })
      .then((response) => {
        if (response.status !== 200) {
          dispatch({ type: types.LOGIN_ERROR, error: response });
        }
        dispatch(receiveLogin(response.data));
      })
      .catch((error) => {
        dispatch({ type: types.LOGIN_ERROR, error });
      });
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

export function loginIfNeeded(code, provider) {
  return (dispatch, getState) => {
    const { aouth } = getState();
    if (aouth.isFetching || aouth.isError || aouth.isAouth) {
      return Promise.resolve();
    }
    return dispatch(login(code, provider));
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
      return dispatch(loginIfNeeded(attr.code, attr.provider));
    }
    // error
    return Promise.resolve();
  };
}

export function geusLogin() {
  const aouth = {
    avater_url: 'none',
    expire: '9999-99-99',
    name: 'ゲスト',
    token: 'guest',
  };
  setCookieAouth(aouth);
  return dispatch => (dispatch({ type: types.GEUST_LOGIN, aouth }));
}

export function logout() {
  return (dispatch) => {
    cookies.remove('aouth', { path: '/' });
    dispatch({ type: types.LOGOUT });
    geusLogin();
  };
}

export function isCookieAouth() {
  return (dispatch, getState) => {
    const aouthCookie = cookies.get('aouth');
    if (aouthCookie === undefined) {
      // ゲストログイン
      geusLogin();
      return Promise.resolve();
    } else if (aouthCookie.token === 'guest') {
      return Promise.resolve();
    }
    return dispatch(loginFromQookie(aouthCookie));
  };
}

export function startAouthGithub() {
  return (dispatch) => {
    const { REACT_APP_Github_ClientID, REACT_APP_API_Scheme, REACT_APP_FRONT_Host } = process.env;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${REACT_APP_Github_ClientID}&scope=user:email&redirect_uri=${REACT_APP_API_Scheme}${REACT_APP_FRONT_Host}/login?provider=github`;// eslint-disable-line
    return dispatch(startAouth());
  };
}
export function startOauthFacebook() {
  return (dispatch) => {
    const { REACT_APP_Facebook_ClientID, REACT_APP_API_Scheme, REACT_APP_FRONT_Host } = process.env;
    window.location.href = `https://www.facebook.com/dialog/oauth?client_id=${REACT_APP_Facebook_ClientID}&redirect_uri=${REACT_APP_API_Scheme}${REACT_APP_FRONT_Host}/login?provider=facebook/&response_type=code&scope=public_profile+email`;// eslint-disable-line
    return dispatch(startAouth());
  };
}
