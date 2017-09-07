import error from './Error';
import autosuggest from './Autosuggest';
import aouth from './Aouth';
import searchStash from './SearchStash';
import listOfEvent from './Events/';

const reducers = {
  events: listOfEvent,
  error,
  autosuggest,
  aouth,
  searchStash,
};

export default reducers;
