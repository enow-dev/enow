import {
  PUT_FAVORITE,
  PUT_RECEIVE_FAVORITE,
  DELETE_FAVORITE,
  DELETE_RECEIVE_FAVORITE,
} from '../../Constants/ActionTypes';

const initialState = {
  isPutiing: false,
  isDeleting: false,
  resultEventId: null,
};

export default function favorite(state = initialState, action) {
  switch (action.type) {
    case PUT_FAVORITE:
      return Object.assign({}, state, { isPutiing: true, resultEventId: null });
    case PUT_RECEIVE_FAVORITE:
      return Object.assign({}, state, { isPutiing: false, resultEventId: action.item.id });
    case DELETE_FAVORITE:
      return Object.assign({}, state, { isDeleting: true, resultEventId: null });
    case DELETE_RECEIVE_FAVORITE:
      return Object.assign({}, state, { isDeleting: false, resultEventId: action.item.id });
    default:
      return state;
  }
}
