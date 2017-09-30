// Common
export const REQUEST = 'REQUEST';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`
		return acc;
  }, {});
}

export const ADD_EVENT = 'ADD_EVENT';
// Events
export const FETCH_EVENTS = 'FETCH_EVENTS';
export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';
export const EVENTS = createRequestTypes('EVENTS');
// Event
export const RECEIVE_EVENT = 'RECEIVE_EVENT';
export const CLEAR_EVENTS = 'CLEAR_EVENTS';
export const EVENT = createRequestTypes('EVENT');
// Error
export const ADD_ERROR = 'ADD_ERROR';
export const REMOVE_ERROR = 'REMOVE_ERROR';
// Autosuggest
export const FETCH_AUTOSUGGEST = 'FETCH_AUTOSUGGEST';
export const RECEIVE_AUTOSUGGEST = 'RECEIVE_AUTOSUGGEST';
export const CLEAR_AUTOSUGGEST = 'CLEAR_AUTOSUGGEST';
// OAuth
export const START_OAUTH = 'START_OAUTH';
export const REDIRECT_OAUTH = 'REDIRECT_OAUTH';
export const FETCH_LOGIN = 'FETCH_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';
export const LOGIN_FROM_QOOKIE = 'LOGIN_FROM_QOOKIE';
export const GEUST_LOGIN = 'GEUST_LOGIN';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';
// Search Stash
export const SET_SEARCH = 'SET_SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
// Favorite
export const FETCH_FAVORITE = 'FETCH_FAVORITE';
export const RECEIVE_FAVORITE = 'RECEIVE_FAVORITE';
export const PUT_FAVORITE = 'PUT_FAVORITE';
export const PUT_RECEIVE_FAVORITE = 'PUT_RECEIVE_FAVORITE';
export const DELETE_FAVORITE = 'DELETE_FAVORITE';
export const DELETE_RECEIVE_FAVORITE = 'DELETE_RECEIVE_FAVORITE';
// Favorites
export const FETCH_FAVORITES = 'FETCH_FAVORITES';
export const RECEIVE_FAVORITES = 'RECEIVE_FAVORITES';
// Events Count
export const FETCH_EVENTS_COUNT = 'FETCH_EVENTS_COUNT';
export const RECEIVE_EVENTS_COUNT = 'RECEIVE_EVENTS_COUNT';
