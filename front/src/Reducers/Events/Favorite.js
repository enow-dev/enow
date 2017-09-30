import * as types from '../../Constants/ActionTypes';

const initialState = {
  isPutiing: false,
  isDeleting: false,
  resultEventId: null,
};

export default function favorite(state = initialState, action) {
  switch (action.type) {
    case types.FAVORITE[types.REQUEST]:
      return Object.assign({}, state, { isPutiing: true, resultEventId: null });
    case types.FAVORITE[types.SUCCESS]:
      return Object.assign({}, state, { isPutiing: false, resultEventId: action.item.id });
    case types.DELETE_FAVORITE[types.REQUEST]:
      return Object.assign({}, state, { isDeleting: true, resultEventId: null });
    case types.DELETE_FAVORITE[types.SUCCESS]:
      return Object.assign({}, state, { isDeleting: false, resultEventId: action.item.id });
    default:
      return state;
  }
}
