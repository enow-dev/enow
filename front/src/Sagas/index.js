import { take, put, call, fork, select, all } from 'redux-saga/effects';
import { api, history } from '../Services';
import * as eventsActions from '../Actions/Events';
import * as eventActions from '../Actions/Event';
import * as favoriteActions from '../Actions/Favorite';

const { events } = eventsActions;
const { event } = eventActions;
const { favorite } = favoriteActions;

/* **************************** Subroutines *********************************** */

function* fetchEntity(entity, apiFn, apiFnArgs) {
  yield put(entity.request(apiFnArgs));
  const { response, error } = yield call(apiFn, { ...apiFnArgs });
  if (response) {
    yield put(entity.success(response));
  } else {
    yield put(entity.failure(error));
  }
}

// bind Generators
export const fetchEvents = fetchEntity.bind(null, events, api.fetchEvents);
export const fetchEvent = fetchEntity.bind(null, event, api.fetchEvent);
export const putFavorite = fetchEntity.bind(null, favorite, api.putFavorite);
export const deleteFavorite = fetchEntity.bind(null, favorite, api.deleteFavorite);
/* **************************************************************************** */
/* ****************************** WATCHERS ************************************ */
/* **************************************************************************** */

function* watchLoadEvents() {
  while (true) {
    const results = yield take(eventsActions.GET_EVENTS);
    yield call(fetchEvents, { ...results });
  }
}

function* watchLoadEvent() {
  while (true) {
    const results = yield take(eventActions.GET_EVENT);
    yield call(fetchEvent, { ...results });
  }
}

function* watchPutFavorite() {
  while (true) {
    const results = yield take(favoriteActions.PUT_FAVORITE);
    yield call(putFavorite, { ...results });
  }
}

function* watchDeleteFavorite() {
  while (true) {
    const results = yield take(favoriteActions.DELETE_FAVORITE);
    yield call(deleteFavorite, { ...results });
  }
}
export default function* root() {
  yield all([
    fork(watchLoadEvents),
    fork(watchLoadEvent),
    fork(watchPutFavorite),
    fork(watchDeleteFavorite),
  ]);
}
