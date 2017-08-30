import { ADD_ERROR, REMOVE_ERROR } from '../Constants/ActionTypes';

const initialState = {
  error: {
    type: 'none',
    statusCode: 0,
  },
  isError: false,
};

export default function error(state = initialState, action){
  switch(action.type) {
    case ADD_ERROR:
      return Object.assign({}, state, { isError: true, error: action.error});
    case REMOVE_ERROR:
      return initialState;
    default:
      return state;
  }
}
