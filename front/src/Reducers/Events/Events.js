import { RECEIVE_EVENTS, FETCH_EVENTS, SET_EVENTS } from '../../Constants/ActionTypes';
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
    switch (action.type) {
      case actionTypes.RECEIVE_EVENTS: {
        const { events, ...rest } = action;
        if (typeof events !== 'undefined') {
          return Object.assign(
            {},
            state,
            {
              isFetching: false,
              isMoreFetching: false,
              list: events.map(item => eventReducer(item, { type: SET_EVENTS })),
            },
          );
        }
        return Object.assign({}, state, { isMoreFetching: false });
      }
      case actionTypes.FETCH_EVENTS: {
        if (action.isMoreRead) {
          return Object.assign({}, state, { isMoreFetching: true });
        }
        return Object.assign({}, state, { isFetching: true });
      }
      default: {
        const { index, ...rest } = action;
        if (typeof index !== 'undefined') {
          return state.events.map(item => eventReducer(item, rest));
        }
        return state;
      }
    }
  };
}

const listOfEvent = list(eventReducer, {
  RECEIVE_EVENTS,
  FETCH_EVENTS,
});

export default listOfEvent;
