import { RECEIVE_AUTOSUGGEST, FETCH_AUTOSUGGEST, CLEAR_AUTOSUGGEST } from '../Constants/ActionTypes';

const initialState = {
  suggests: [],
  isFetching: false,
};

export default function autosuggest(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_AUTOSUGGEST:
      return Object.assign({}, state, {
        isFetching: false,
        suggests: [...action.suggests],
      });
    case FETCH_AUTOSUGGEST:
      return Object.assign({}, state, { isFetching: false });
    case CLEAR_AUTOSUGGEST:
      return Object.assign({}, state, { isFetching: false });
    default:
      return state;
  }
}
