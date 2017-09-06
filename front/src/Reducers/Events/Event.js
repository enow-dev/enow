import { RECEIVE_EVENT, FETCH_EVENT, SET_EVENTS } from '../../Constants/ActionTypes';

const initialState = {
  item: {
    accepted: '',
    address: '',
    apiId: 0,
    createdAt: '',
    description: '',
    endAt: '',
    id: '',
    isFavorite: false,
    lat: 0,
    limit: 0,
    lon: 0,
    place: '',
    startAt: '',
    title: '',
    updatedAt: '',
    url: '',
    waiting: 0,
  },
  isFetching: false,
};

const adaptationEvent = (event) => {
  console.log(event);
  const newEvent = {
    apiId: event.api_id,
    createdAt: event.created_at,
    endAt: event.end_at,
    isFavorite: event.is_favorite,
    startAt: event.start_at,
    updatedAt: event.updated_at,
    ...event,
  };
  return newEvent;
};
const adaptationEvents = (event) => {
  const newEvent = {
    apiId: event.api_id,
    createdAt: event.created_at,
    endAt: event.end_at,
    isFavorite: event.is_favorite,
    startAt: event.start_at,
    updatedAt: event.update_at,
    ...event,
  };
  return newEvent;
};

export default function event(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_EVENT: {
      const newEvent = adaptationEvent(action.event);
      return Object.assign({}, state, { isFetching: false, item: newEvent });
    }
    case FETCH_EVENT:
      return Object.assign({}, state, { isFetching: true });
    case SET_EVENTS: {
      const newEvent = adaptationEvents(state);
      return Object.assign({ isFetching: false, ...newEvent });
    }

    default:
      return state;
  }
}
