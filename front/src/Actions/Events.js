import * as types from '../Constants/ActionTypes';

export const addEvent = event => ({ type: types.ADD_EVENT, event });
export function fetchEvent(isFavorite, isRed) {
  const url = `http://localhost:8080/api/events?is_favorite=${isFavorite}&is_red=${isRed}`;
  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.event+json',
      'X-Authorization': 'hogehoge',
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
    });
}
