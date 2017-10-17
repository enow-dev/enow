import { expectSaga } from 'redux-saga-test-plan';
import rootSagas from '../index';
import * as types from '../../Constants/ActionTypes';
import * as eventsActions from '../../Actions/Events';
import eventsReducer from '../../Reducers/Events/index';
import { api } from '../../Services/__mocks__';

let eventsData = null;

beforeAll(async () => {
  eventsData = await api.fetchEvents({ url: 'http://localhost:8080/api/events' });
});

describe('events saga', () => {
  describe('Minimum check handling fetchEvents response data with reducer', () => {
    test('response anything', () => {
      expect(eventsData.response).toEqual(expect.anything());
    });
    test('response inseide object containing', () => {
      expect(eventsData.response).toEqual(expect.objectContaining({
        entities: {
          events: expect.any(Object),
        },
        result: expect.any(Array),
        link: expect.anything(),
      }));
    });
  });
  describe('watchLoadEvents', () => {
    test('SUCCESS', async () => {
      const { storeState } = await expectSaga(rootSagas, api)
        .provide({
          call(effect, next) {
            if (api.fetchEvents === effect.fn) {
              return eventsData;
            }
            return next();
          },
        })
        .withReducer(eventsReducer)
        .put({ type: types.EVENTS[types.REQUEST] })
        .put({
          type: types.EVENTS[types.SUCCESS],
          ...eventsData,
        })
        .dispatch({
          type: eventsActions.GET_EVENTS,
          url: 'http://localhost:8080/api/events',
          params: 'hoge',
        })
        .run();
      return expect(storeState).toEqual(expect.objectContaining({
        list: expect.any(Array),
        isFetching: false,
        isMoreFetching: false,
        link: expect.any(Object),
      }));
    });
    test('FAILURE', async () => {
      const error = new Error('events FAILURE');
      const { storeState } = await expectSaga(rootSagas, api)
        .provide({
          call(effect, next) {
            if (effect.fn === api.fetchEvents) {
              return { error: error.message };
            }
            return next();
          },
        })
        .withReducer(eventsReducer)
        .put({ type: types.EVENTS[types.REQUEST] })
        .put({
          type: types.EVENTS[types.FAILURE],
          error: 'events FAILURE',
        })
        .dispatch({
          type: eventsActions.GET_EVENTS,
          url: '/events',
          params: 'hoge',
        })
        .run();
      return expect(storeState).toEqual(expect.anything());
    });
  });
});
