import { FETCH_LOGIN, RECEIVE_LOGIN, LOGIN_ERROR, LOGOUT } from '../Constants/ActionTypes';

const initialState = {
  info: {
    expire: '',
    name: '',
    token: '',
  },
  error: null,
  isError: false,
  isFetching: false,
  isAouth: false,
};


export default function aouth(state = initialState, action) {
  console.log(action.type);
  switch (action.type) {
    case RECEIVE_LOGIN:
      return Object.assign({}, state, { isFetching: false, info: action.aouth, isAouth: true });
    case FETCH_LOGIN:
      return Object.assign({}, state, { isFetching: true });
    case LOGIN_ERROR:
      return Object.assign({}, state, { error: action.error, isFetching: false, isAouth: false, isError: true });
    case LOGOUT:
      return Object.assign({}, state, { isAouth: false, isFetching: false });
    default:
      return state;
  }
}
