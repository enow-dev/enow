import * as types from '../Constants/ActionTypes';

const initialState = {
  count: -1,
  isFetching: false,
};

export default function eventsCount(state = initialState, action) {
  switch (action.type) {
    case types.EVENTS_COUNT[types.REQUEST]:
      return {
        ...state,
        isFetching: true,
      };
    case types.EVENTS_COUNT[types.SUCCESS]:
      return {
        ...state,
        isFetching: false,
        count: action.response,
      };
    default:
      return state;
  }
}
