import * as types from '../Constants/ActionTypes';

export const receiveLogin = aouth => (
  { type: types.RECEIVE_LOGIN, aouth }
);
export const fetchLogin = () => ({ type: types.FETCH_LOGIN });

function login(code) {
  let scheme = process.env.REACT_APP_API_Scheme;
  if (scheme == null) {
    scheme = process.env.Scheme;
  }
  let host = process.env.REACT_APP_API_Host;
  if (host == null) {
    host = process.env.Host;
  }
  const url = `http://localhost:8080/auth/login?code=${code}`;
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

export function loginIfNeeded(code) {
  return (dispatch, getState) => {
    const { aouth } = getState();
    if (aouth.isFetching || aouth.isError || aouth.isAouth) {
      return Promise.resolve();
    }
    return dispatch(login(code));
  };
}
