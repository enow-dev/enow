import React from 'react';
import { Switch, Route, BrowserRouter as Router, withRouter } from 'react-router-dom';
import Aouth from './Components/Aouth';
import Header from './Components/Header';
import Home from './Components/Home';
import Login from './Components/Login';
import Events from './Components/Events';
import NotFound from './Components/NotFound';

class App extends React.Component {
  render() {
    return (
      <Aouth>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/events" component={Events} />
            <Route path="/NotFound" component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </Aouth>
    );
  }
}

export default withRouter(App);
