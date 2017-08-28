import { RECEIVE_EVENT, FETCH_EVENT } from '../Constants/ActionTypes';

const initialState = {
  list: [],
  isFetching: false,
};

export default function events(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_EVENT: {
      const newEvents = [];
      action.events.map(item =>
        newEvents.push({
          accepted: item.accepted,
          address: item.address,
          apiId: item.apiId,
          createdAt: item.created_at,
          description: item.description,
          endAt: item.end_at,
          id: item.id,
          idStr: item.id_str,
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
      return Object.assign({}, state, { isFetching: false, list: newEvents });
    }
    case FETCH_EVENT:
      return Object.assign({}, state, { isFetching: true });
    default:
      return state;
  }
}
