import {
  RECEIVE_EVENTS,
  FETCH_EVENTS,
  FETCH_EVENT,
  RECEIVE_EVENT,
  PUT_FAVORITE,
  PUT_RECEIVE_FAVORITE,
} from '../../Constants/ActionTypes';
import eventReducer from './Event';

const initialState = {
  list: [],
  isFetching: false,
  isMoreFetching: false,
};

function list(eventReducer, actionTypes) {
  return (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.RECEIVE_EVENTS: {
        const { events } = action;
        if (typeof events !== 'undefined') {
          return {
            ...state,
            isFetching: false,
            isMoreFetching: false,
            list: events.map(event => eventReducer(event, { type: RECEIVE_EVENT })),
          };
        }
        return Object.assign({}, state, { isMoreFetching: false });
      }
      case actionTypes.FETCH_EVENTS: {
        if (action.isMoreRead) {
          return Object.assign({}, state, { isMoreFetching: true });
        }
        return Object.assign({}, state, { isFetching: true });
      }
      case FETCH_EVENT:
      case RECEIVE_EVENT:
      case PUT_FAVORITE:
      case PUT_RECEIVE_FAVORITE: {
        const { event, ...rest } = action;
        if (typeof event !== 'undefined') {
          return {
            ...state,
            list: state.list.map((eventOfList) => {
              if (eventOfList.item.id === event.id) {
                return eventReducer(event, rest);
              }
              return eventOfList;
            }),
          };
        }
        return state;
      }
      default:
        return state;
    }
  };
}

const listOfEvent = list(eventReducer, {
  RECEIVE_EVENTS,
  FETCH_EVENTS,
});

export default listOfEvent;
