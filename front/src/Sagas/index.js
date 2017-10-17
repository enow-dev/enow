import { take, put, call, fork, all } from 'redux-saga/effects';
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
export const fetchEvents = fetchEntity.bind(null, events);
export const fetchEvent = fetchEntity.bind(null, event);
export const putFavorite = fetchEntity.bind(null, favorite);
export const deleteFavorite = fetchEntity.bind(null, favorite);
export const postOAuth = fetchEntity.bind(null, login);
export const fetchEventsCount = fetchEntity.bind(null, eventsCount);

/* **************************************************************************** */
/* ****************************** WATCHERS ************************************ */
/* **************************************************************************** */

export function* watchLoadEvents(api) {
  while (true) {
    const results = yield take(eventsActions.GET_EVENTS);
    yield call(fetchEvents, api.fetchEvents, { ...results });
  }
}

export function* watchLoadEvent(api) {
  while (true) {
    const results = yield take(eventActions.GET_EVENT);
    yield call(fetchEvent, api.fetchEvent, { ...results });
  }
}

export function* watchPutFavorite(api) {
  while (true) {
    const results = yield take(favoriteActions.PUT_FAVORITE);
    yield call(putFavorite, api.putFavorite, { ...results });
  }
}

export function* watchDeleteFavorite(api) {
  while (true) {
    const results = yield take(favoriteActions.DELETE_FAVORITE);
    yield call(deleteFavorite, api.deleteFavorite, { ...results });
  }
}

export function* watchPutOAuth(api) {
  while (true) {
    const results = yield take(oauthActions.POST_OAUTH);
    yield call(postOAuth, api.postOAuth, { ...results });
  }
}

export function* watchEventsCount(api) {
  while (true) {
    const results = yield take(eventsCountActions.GET_EVENTS_COUNT);
    yield call(fetchEventsCount, api.fetchEventsCount, { ...results });
  }
}

export default function* root(api) {
  yield all([
    fork(watchLoadEvents, api),
    fork(watchLoadEvent, api),
    fork(watchPutFavorite, api),
    fork(watchDeleteFavorite, api),
    fork(watchPutOAuth, api),
    fork(watchEventsCount, api),
  ]);
}
