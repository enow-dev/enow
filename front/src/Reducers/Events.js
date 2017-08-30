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
      accepted: item.accepted,
      address: item.address,
      apiId: item.apiId,
      createdAt: item.created_at,
      description: item.description,
      endAt: item.end_at,
      id: item.id,
      isFavorite: item.is_favorite,
      lat: item.lat,
      limit: item.limit,
      lon: item.lon,
      place: item.place,
      startAt: item.start_at,
      title: item.title,
      updatedAt: item.update_at,
      url: item.url,
      waiting: item.waiting,
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
