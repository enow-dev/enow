import { SET_SEARCH, CLEAR_SEARCH } from '../Constants/ActionTypes';

const initialState = {
  keyword: '',
  prefIndex: 0,
  isRed: false,
  isFavorite: false,
  fromDate: '',
};

export default function searchStash(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH: {
      return Object.assign(state, action.search);
    }
    case CLEAR_SEARCH:
      return state;
    default:
      return state;
  }
}
