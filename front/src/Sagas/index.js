import { take, put, call, fork, select, all } from 'redux-saga/effects';
import { api, history } from '../Services';
import * as actions from '../Actions/Events';

const { events } = actions

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

function* loadEvents(args) {
  yield call(fetchEvents, { ...args });
}

/* **************************************************************************** */
/* ****************************** WATCHERS ************************************ */
/* **************************************************************************** */

function* watchLoadEvents() {
  while (true) {
    const results = yield take(actions.GET_EVENTS);
    yield fork(loadEvents, { ...results });
  }
}

export default function* root() {
  yield all([
    fork(watchLoadEvents),
  ]);
}
