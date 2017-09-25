import * as types from '../../Constants/ActionTypes';
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
            list: [...state.list, ...events.map(event => eventReducer({}, { type: types.RECEIVE_EVENT, item: event }))],
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
      case types.FETCH_EVENT:
      case types.RECEIVE_EVENT:
      case types.PUT_FAVORITE:
      case types.PUT_RECEIVE_FAVORITE: {
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
      case types.CLEAR_EVENTS:
        return initialState;
      case types.EVENTS[types.REQUEST]: {
        return Object.assign({}, state, { isFetching: true });
      }
      case types.EVENTS[types.SUCCESS]: {
        if (action.response && action.response.entities) {
          return {
            ...state,
            list: [
              ...state.list,
              ...action.response.result.map((index) => {
                return eventReducer({}, { type: types.RECEIVE_EVENT, item: action.response.entities.events[index] });
              })],
            isFetching: false,
            link: action.response.link,
          };
        }
        return state;
      }
      case types.EVENTS[types.FAILURE]:
        return {
          ...state,
          error: action.error,
          isFetching: false,
        };
      default:
        return state;
    }
  };
}

const listOfEvent = list(eventReducer, {
  RECEIVE_EVENTS: types.RECEIVE_EVENTS,
  FETCH_EVENTS: types.FETCH_EVENTS,
});

export default listOfEvent;
