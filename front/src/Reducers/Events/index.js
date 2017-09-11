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
  link: null,
};

function list(eventReducer, actionTypes) {
  return (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.RECEIVE_EVENTS: {
        const { events, link } = action;
        if (typeof events !== 'undefined') {
          return {
            ...state,
            isFetching: false,
            isMoreFetching: false,
            list: [...state.list, ...events.map(event => eventReducer({}, { type: RECEIVE_EVENT, item: event }))],
            link,
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
              if (eventOfList.item.id === event.item.id) {
                return eventReducer(eventOfList, { ...rest, item: event.item });
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
