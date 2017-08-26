import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import reducers from './Reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const history = createHistory();
const middleware = routerMiddleware(history);

const reducer = combineReducers({
  ...reducers,
  router: routerReducer,
});

const store = createStore(reducer, applyMiddleware(middleware));

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
