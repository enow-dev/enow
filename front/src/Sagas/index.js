import { take, put, call, fork, select, all } from 'redux-saga/effects';
import { api, history } from '../Services';
import * as eventsActions from '../Actions/Events';
import * as eventActions from '../Actions/Event';

const { events } = eventsActions;
const { event } = eventActions;

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

  }
}

export default function* root() {
  yield all([
    fork(watchLoadEvents),
    fork(watchLoadEvent),
  ]);
}
