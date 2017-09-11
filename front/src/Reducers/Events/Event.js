import {
  RECEIVE_EVENT,
  FETCH_EVENT,
  PUT_FAVORITE,
  PUT_RECEIVE_FAVORITE,
} from '../../Constants/ActionTypes';
import favoriteReducer from './Favorite';

const initialState = {
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
  isFetching: false,
  favorite: null,
};

export default function event(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_EVENT:
      return {
        isFetching: false,
        item: {
          ...state.item,
          ...action.item,
        },
      };
    case FETCH_EVENT:
      return Object.assign({}, state, { isFetching: true });
    case PUT_FAVORITE:
    case PUT_RECEIVE_FAVORITE:
      return {
        ...state,
        favorite: favoriteReducer(null, { ...action, ...state }),
      };
    default:
      return state;
  }
}
