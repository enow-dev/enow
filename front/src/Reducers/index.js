import error from './Error';
import autosuggest from './Autosuggest';
import aouth from './Aouth';
import searchStash from './SearchStash';
import listOfEvent from './Events/';
import eventsCount from './EventsCount';

const reducers = {
  events: listOfEvent,
  error,
  autosuggest,
  aouth,
  searchStash,
  eventsCount,
};

export default reducers;
