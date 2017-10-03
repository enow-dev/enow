import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { cyan, teal } from 'material-ui/colors';
import MediaQuery from 'react-responsive';
import dotenv from 'dotenv';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import reducers from './Reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import mySaga from './Sagas';
import { api } from './Services';

const history = createHistory();
const middleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  ...reducers,
  router: routerReducer,
});

const logger = createLogger({
  duration: true,
});

const store = createStore(reducer, applyMiddleware(middleware, thunk, logger, sagaMiddleware));

sagaMiddleware.run(mySaga, api);

const theme = {
  typography: {
    fontFamily:
       '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Yu Gothic", YuGothic, "ヒラギノ角ゴ ProN W3", Hiragino Kaku Gothic ProN, Arial, "メイリオ", Meiryo, sans-serif',
  },
  palette: {
    primary: cyan,
    secondary: teal,
  },
};

const webTheme = createMuiTheme({
  ...theme,
});

const nativeTheme = createMuiTheme({
  ...theme,
  typography: {
    display3: {
      fontSize: 34,
    },
    display1: {
      fontSize: 21,
    },
    headline: {
      fontSize: 16,
    },
    title: {
      fontSize: 14,
    },
  },
});

dotenv.config();

function ResponsiveTheme({ children }) {
  return (
    <div>
      <MediaQuery query="(max-width: 1024px)">
        <MuiThemeProvider theme={nativeTheme}>
          {children}
        </MuiThemeProvider>
      </MediaQuery>
      <MediaQuery query="(min-width: 1025px)">
        <MuiThemeProvider theme={webTheme}>
          {children}
        </MuiThemeProvider>
      </MediaQuery>
    </div>
  );
}
ResponsiveTheme.propTypes = {
  children: PropTypes.node.isRequired,
};

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {/*<MuiThemeProvider theme={theme}> */}
        <ResponsiveTheme>
          <App />
        </ResponsiveTheme>
      {/*</MuiThemeProvider>*/}
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
