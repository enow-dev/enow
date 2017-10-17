import rest from 'rest';
import mime from 'rest/interceptor/mime';
import defaultRequest from 'rest/interceptor/defaultRequest';
import jsonp from 'rest/interceptor/jsonp';

export default rest.wrap(jsonp);
