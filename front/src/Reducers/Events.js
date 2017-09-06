import { RECEIVE_EVENTS, FETCH_EVENTS } from '../Constants/ActionTypes';

const initialState = {
  list: [],
  isFetching: false,
  isMoreFetching: false,
};

const adaptationEvents = (events) => {
  const newEvents = [];
  events.map(item =>
    newEvents.push({
      apiId: item.api_id,
      createdAt: item.created_at,
      endAt: item.end_at,
      isFavorite: item.is_favorite,
      startAt: item.start_at,
      updatedAt: item.update_at,
      ...item,
    }),
  );
  return newEvents;
};

export default function events(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_EVENTS: {
      const newEvents = adaptationEvents(action.events);
      if (action.isMoreRead) {
        return Object.assign({}, state, { isMoreFetching: false,
          list: [...newEvents, ...state.list],
        });
      }
      return Object.assign({}, state, { isFetching: false, list: newEvents });
    }
    case FETCH_EVENTS:
      if (action.isMoreRead) {
        return Object.assign({}, state, { isMoreFetching: true });
      }
      return Object.assign({}, state, { isFetching: true });
    default:
      return state;
  }
}
