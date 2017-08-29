import { RECEIVE_EVENT, FETCH_EVENT } from '../Constants/ActionTypes';

const initialState = {
  event: {},
  isFetching: false,
};

const adaptationEvent = (event) => {
  const newEvent = {
    accepted: event.accepted,
    address: event.address,
    apiId: event.api_id,
    createdAt: event.created_at,
    description: event.description,
    endAt: event.end_at,
    id: event.id,
    idStr: event.id_str,
    isFavorite: event.is_favorite,
    lat: event.lat,
    limit: event.limit,
    lon: event.lon,
    place: event.place,
    startAt: event.start_at,
    title: event.title,
    updatedAt: event.updated_at,
    url: event.url,
    waiting: event.waiting,
  };
  return newEvent;
};

export default function event(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case RECEIVE_EVENT: {
      const newEvent = adaptationEvent(action.event);
      return Object.assign({}, state, { isFetching: false, event: newEvent });
    }
    case FETCH_EVENT:
      return Object.assign({}, state, { isFetching: true });
    default:
      return state;
  }
}
