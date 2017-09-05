import { PUT_FAVORITE, PUT_RECEIVE_FAVORITE } from '../Constants/ActionTypes';

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
      return Object.assign({}, state, { isPutiing: false, resultEventId: action.eventId });
    default:
      return state;
  }
}
