import error from './Error';
import autosuggest from './Autosuggest';
import oauth from './OAuth';
import searchStash from './SearchStash';
import listOfEvent from './Events/';
import eventsCount from './EventsCount';

const reducers = {
  events: listOfEvent,
  error,
  autosuggest,
  oauth,
  searchStash,
  eventsCount,
};

export default reducers;
