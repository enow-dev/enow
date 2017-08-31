import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { orange, cyan, teal } from 'material-ui/colors';
import reducers from './Reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import dotenv from 'dotenv';

const history = createHistory();
const middleware = routerMiddleware(history);

const reducer = combineReducers({
  ...reducers,
  router: routerReducer,
});

const store = createStore(reducer, applyMiddleware(middleware, thunk));

const theme = createMuiTheme({
  typography: {
    fontFamily:
       '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Yu Gothic", YuGothic, "ヒラギノ角ゴ ProN W3", Hiragino Kaku Gothic ProN, Arial, "メイリオ", Meiryo, sans-serif',
  },
  palette: {
    primary: cyan,
    secondary: teal,
    accent: orange,
  },
});

dotenv.config();

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
