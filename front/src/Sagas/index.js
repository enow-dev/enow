import { take, put, call, fork, all } from 'redux-saga/effects';
import { api } from '../Services';
import * as eventsActions from '../Actions/Events';
import * as eventActions from '../Actions/Event';
import * as favoriteActions from '../Actions/Favorite';
import * as oauthActions from '../Actions/OAuth';
import * as eventsCountActions from '../Actions/EventsCount';

const { events } = eventsActions;
const { event } = eventActions;
const { favorite } = favoriteActions;
const { login } = oauthActions;
const { eventsCount } = eventsCountActions;
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
export const postOAuth = fetchEntity.bind(null, login, api.postOAuth);
export const fetchEventsCount = fetchEntity.bind(null, eventsCount, api.fetchEventsCount);

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

function* watchPutOAuth() {
  while (true) {
    const results = yield take(oauthActions.POST_OAUTH);
    yield call(postOAuth, { ...results });
  }
}

function* watchEventsCount() {
  while (true) {
    const results = yield take(eventsCountActions.GET_EVENTS_COUNT);
    yield call(fetchEventsCount, { ...results });
  }
}
export default function* root() {
  yield all([
    fork(watchLoadEvents),
    fork(watchLoadEvent),
    fork(watchPutFavorite),
    fork(watchDeleteFavorite),
    fork(watchPutOAuth),
    fork(watchEventsCount),
  ]);
}
