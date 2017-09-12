import { FETCH_EVENTS_COUNT, RECEIVE_EVENTS_COUNT } from '../Constants/ActionTypes';

const initialState = {
  count: -1,
  isFetching: false,
};

export default function eventsCount(state = initialState, action) {
  switch (action.type) {
    case FETCH_EVENTS_COUNT:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_EVENTS_COUNT:
      return {
        ...state,
        isFetching: false,
        count: action.count,
      };
    default:
      return state;
  }
}
