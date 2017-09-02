import {
  START_AOUTH,
  REDIRECT_AOUTH,
  FETCH_LOGIN,
  RECEIVE_LOGIN,
  LOGIN_ERROR,
  LOGOUT,
} from '../Constants/ActionTypes';

const initialState = {
  info: {
    avaterUrl: '',
    expire: '',
    name: '',
    token: '',
  },
  error: null,
  isError: false,
  isAouthing: false,
  isFetching: false,
  isAouth: false,
  isRedirect: false,
};

const adaptionAouthInfo = (info) => {
  const newInfo = {
    avaterUrl: info.avater_url,
    ...info,
  };
  return newInfo;
};

export default function aouth(state = initialState, action) {
  console.log(action.type);
  switch (action.type) {
    case START_AOUTH:
      return Object.assign({}, state, { isAouthing: true, isRedirect: false });
    case REDIRECT_AOUTH:
      return Object.assign({}, state, { isRedirect: true, isAouthing: true });
    case FETCH_LOGIN:
      return Object.assign({}, state, { isFetching: true });
    case RECEIVE_LOGIN: {
      const newInfo = adaptionAouthInfo(action.aouth);
      return Object.assign({}, state, {
        isFetching: false,
        info: newInfo,
        isAouth: true,
        isAouthing: false,
      });
    }
    case LOGIN_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        isFetching: false,
        isAouth: false,
        isError: true,
      });
    case LOGOUT:
      return Object.assign({}, state, { isAouth: false, isFetching: false, isRedirect: false, isAouthing: false });
    default:
      return state;
  }
}
