import * as types from '../../Constants/ActionTypes';
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
    case types.SET_EVENT:
    case types.EVENT[types.SUCCESS]:
      return {
        isFetching: false,
        item: {
          ...state.item,
          ...action.item,
        },
      };
    case types.EVENT[types.REQUEST]:
      return Object.assign({}, state, { isFetching: true });
    case types.FAVORITE[types.REQUEST]:
    case types.FAVORITE[types.SUCCESS]:
      return {
        ...state,
        favorite: favoriteReducer(null, { ...action, ...state }),
      };
    default:
      return state;
  }
}
