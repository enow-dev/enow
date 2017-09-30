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
      case types.EVENT[types.REQUEST]:
      case types.EVENT[types.SUCCESS]:
      case types.FAVORITE[types.REQUEST]:
      case types.FAVORITE[types.SUCCESS]: {
        const { response, ...rest } = action;
        if (typeof response !== 'undefined') {
          const { entities, result } = response;
          const event = entities.events[result];
          return {
            ...state,
            list: state.list.map((eventOfList) => {
              if (eventOfList.item.id === event.id) {
                return eventReducer(eventOfList, { ...rest, item: event });
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
});

export default listOfEvent;
