import { RECEIVE_EVENTS, FETCH_EVENTS, SET_EVENTS, FETCH_EVENT, RECEIVE_EVENT } from '../../Constants/ActionTypes';
import eventReducer from './Event';

const initialState = {
  list: [],
  isFetching: false,
  isMoreFetching: false,
};


// export default function events(state = initialState, action) {
//   switch (action.type) {
//     case RECEIVE_EVENTS: {
//       if (action.isMoreRead) {
//         return Object.assign({}, state, { isMoreFetching: false,
//           list: [..., ...state.events],
//         });
//       }
//       return Object.assign({}, state, { isFetching: false, list: newEvents });
//     }
//     case FETCH_EVENTS:
//       if (action.isMoreRead) {
//         return Object.assign({}, state, { isMoreFetching: true });
//       }
//       return Object.assign({}, state, { isFetching: true });
//     default:
//       return state;
//   }
// }

function list(eventReducer, actionTypes) {
  return (state = initialState, action) => {
    console.log(state, action);
    switch (action.type) {
      case actionTypes.RECEIVE_EVENTS: {
        const { events, ...rest } = action;
        if (typeof events !== 'undefined') {
          return {
            ...state,
            isFetching: false,
            isMoreFetching: false,
            list: events.map(item => eventReducer(item, { type: SET_EVENTS })),
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
      case SET_EVENTS:
      case FETCH_EVENT:
      case RECEIVE_EVENT: {
        const { event, ...rest } = action;
        if (typeof event !== 'undefined') {
          return {
            ...state,
            list: state.list.map(item => {
              if (item.item.id === event.id) {
                return eventReducer(event, rest);
              }
              return item;
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
