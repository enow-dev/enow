import * as types from '../Constants/ActionTypes';

export const receiveAutosuggest = suggests => ({ type: types.RECEIVE_AUTOSUGGEST, suggests });
export const fetchAutsuggest = () => ({ type: types.FETCH_AUTOSUGGEST });
export const clearAutosuggest = () => ({ type: types.CLEAR_AUTOSUGGEST });
function getSuggest(keyword) {
  return (dispatch) => {
    dispatch(fetchAutsuggest());
    const testcase = ['a', 'abc', 'c#', 'c言語', 'react', 'react native', 'react-native'];
    let result = [];
    const count = 0;
    testcase.filter((val) => {
      const keep =
          count < 5 && val.toLowerCase().slice(0, keyword.length) === keyword;
      if (keep) {
        result = [
          ...result,
          { label: val },
        ];
      }
      return keep;
    });
    dispatch(receiveAutosuggest(result));
  };
}

export function getAutosuggestIfNeeded(keyword) {
  return (dispatch, getState) => {
    if (getState().isFetching) {
      return Promise.resolve();
    }
    return dispatch(getSuggest(keyword));
  };
}
