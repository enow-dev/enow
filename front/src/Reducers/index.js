import events from './Events';
import event from './Event';
import error from './Error';
import autosuggest from './Autosuggest';
import aouth from './Aouth';
import searchStash from './SearchStash';
import favorite from './Favorite';
import listOfEvent from './Events/Events';

const reducers = {
  // events,
  // event,
  events: listOfEvent,
  error,
  autosuggest,
  aouth,
  searchStash,
  favorite,
};

export default reducers;
