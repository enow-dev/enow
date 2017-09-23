import {
  START_OAUTH,
  REDIRECT_OAUTH,
  FETCH_LOGIN,
  RECEIVE_LOGIN,
  LOGIN_FROM_QOOKIE,
  LOGIN_ERROR,
  GEUST_LOGIN,
  LOGOUT,
} from '../Constants/ActionTypes';

const initialState = {
  info: {
    avaterUrl: '',
    expire: '',
    name: '',
    token: '',
  },
  provider: '',
  error: null,
  isError: false,
  isOAuthing: false,
  isFetching: false,
  isOAuth: false,
  isRedirect: false,
};

const adaptionOauthInfo = (info) => {
  const newInfo = {
    avaterUrl: info.avater_url,
    expireDate: new Date(info.expire),
    ...info,
  };
  return newInfo;
};

export default function oauth(state = initialState, action) {
  switch (action.type) {
    case START_OAUTH:
      return Object.assign({}, state, {
        isOAuthing: true,
        isRedirect: false,
      });
    case REDIRECT_OAUTH:
      return Object.assign({}, state, { isRedirect: true, isOAuthing: true });
    case FETCH_LOGIN:
      return Object.assign({}, state, { isFetching: true });
    case RECEIVE_LOGIN: {
      const newInfo = adaptionOauthInfo(action.oauth);
      return Object.assign({}, state, {
        isFetching: false,
        info: newInfo,
        isOAuth: true,
        isOAuthing: false,
      });
    }
    case LOGIN_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        isFetching: false,
        isOAuth: false,
        isError: true,
      });
    case LOGIN_FROM_QOOKIE: {
      const newInfo = adaptionOauthInfo(action.oauth);
      return Object.assign({}, state, {
        isFetching: false,
        info: newInfo,
        isOAuth: true,
        isOAuthing: false,
      });
    }
    case GEUST_LOGIN:
      return {
        ...initialState,
        info: action.oauth,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
