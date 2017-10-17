import { normalize } from 'normalizr';
import humps from 'humps';
import parse from 'parse-link-header';

import request from './request';
import { eventListSchema, eventSchema } from '../Schemas';

function callApi(reqConfig, schema) {
  return request(reqConfig.url)
    .then((response) => {
      if (response.status.code !== 200) {
        return Promise.reject(response);
      }
      let camelizedJson = humps.camelizeKeys(response.entity);
      let link = parse(response.headers.Link);
      if (typeof camelizedJson !== 'object') {
        camelizedJson = JSON.parse(camelizedJson);
      }
      if (!link) {
        link = '';
      }
      return {
        response: Object.assign({},
          normalize(camelizedJson, schema),
          { link },
        ),
      };
    },
    (error) => {
      console.log(error);
      return error;
    })
    .catch(error => ({ error: error || 'Something bad happened' }));
}
export function failureAPI(reqConfig) {

}
export const fetchEvents = reqConfig => callApi(reqConfig, eventListSchema);
export const fetchEvent = reqConfig => callApi(reqConfig, eventSchema);
