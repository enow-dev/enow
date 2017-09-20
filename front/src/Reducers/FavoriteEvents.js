import {
  FETCH_FAVORITE_EVENTS,
  RECEIVE_FAVORITE_EVENTS,
  FETCH_EVENT,
  RECEIVE_EVENT,
  CLEAR_EVENTS,
} from '../Constants/ActionTypes';
import eventReducer from './Events/Event';

const initialState = {
  list: [],
  isFetching: false,
  isMoreFetching: false,
  link: null,
};

function favoriteList(eventReducer, actionTypes) {
  return (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.RECEIVE_FAVORITE_EVENTS: {
        const { events, link } = action;
        if (typeof events !== 'undefined') {
          return {
            ...state,
            isFetching: false,
            isMoreFetching: false,
            list: [
              ...state.list,
              ...events.map(
                event => eventReducer(
                  {},
                  { type: RECEIVE_EVENT, item: event },
                ),
              ),
            ],
            link,
          };
        }
        return Object.assign({}, state, { isMoreFetching: false });
      }
      case actionTypes.FETCH_FAVORITE_EVENTS: {
        if (action.isMoreRead) {
          return Object.assign({}, state, { isMoreFetching: true });
        }
        return Object.assign({}, state, { isFetching: true });
      }
      case FETCH_EVENT:
      case RECEIVE_EVENT: {
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
      case CLEAR_EVENTS:
        return initialState;
      default:
        return state;
    }
  };
}

const favoriteEvent = favoriteList(eventReducer, {
  FETCH_FAVORITE_EVENTS,
  RECEIVE_FAVORITE_EVENTS,
});

export default favoriteEvent;
