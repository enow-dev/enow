import { normalize, schema } from 'normalizr';
import humps from 'humps';
import parse from 'parse-link-header';

import MyAexios from '../Constants/MyAexios';

function callApi(reqConfig, schema) {
  return MyAexios.request(reqConfig)
    .then((response) => {
      if (response.status !== 200) {
        return Promise.reject(response);
      }
      const camelizedJson = humps.camelizeKeys(response.data);
      const link = parse(response.headers.link);
      if (typeof camelizedJson !== 'object') {
        return {
          response: camelizedJson,
        };
      }
      return {
        response: Object.assign({},
          normalize(camelizedJson, schema),
          { link },
        ),
      };
    })
    .catch(error => ({ error: error || 'Something bad happened' }));
}

function callOAuthApi(reqConfig) {
  return MyAexios.request(reqConfig)
    .then((response) => {
      if (response.status !== 200) {
        return Promise.reject(response);
      }
      const camelizedJson = humps.camelizeKeys(response.data);

      return {
        response: camelizedJson,
      };
    })
    .catch(error => ({ error: error || 'Something bad happened' }));
}
const eventSchema = new schema.Entity('events');
const eventListSchema = new schema.Array(eventSchema);

// api service
export const fetchEvents = reqConfig => callApi(reqConfig, eventListSchema);
export const fetchEvent = reqConfig => callApi(reqConfig, eventSchema);
export const putFavorite = reqConfig => callApi(reqConfig, eventSchema);
export const deleteFavorite = reqConfig => callApi(reqConfig, eventSchema);
export const postOAuth = reqConfig => callOAuthApi(reqConfig);
export const fetchEventsCount = reqConfig => callApi(reqConfig);
