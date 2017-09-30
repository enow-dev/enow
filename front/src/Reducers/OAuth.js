import * as types from '../Constants/ActionTypes';

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

export default function oauth(state = initialState, action) {
  switch (action.type) {
    case types.START_OAUTH:
      return Object.assign({}, state, {
        isOAuthing: true,
        isRedirect: false,
      });
    case types.REDIRECT_OAUTH:
      return Object.assign({}, state, { isRedirect: true, isOAuthing: true });
    case types.OAUTH[types.REQUEST]:
      return Object.assign({}, state, { isFetching: true });
    case types.OAUTH[types.SUCCESS]: {
      return Object.assign({}, state, {
        isFetching: false,
        info: action.response,
        isOAuth: true,
        isOAuthing: false,
      });
    }
    case types.LOGIN_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        isFetching: false,
        isOAuth: false,
        isError: true,
      });
    case types.LOGIN_FROM_QOOKIE: {
      return Object.assign({}, state, {
        isFetching: false,
        info: action.oauth,
        isOAuth: true,
        isOAuthing: false,
      });
    }
    case types.GEUST_LOGIN:
      return {
        ...initialState,
        info: action.oauth,
      };
    case types.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
