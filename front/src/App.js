import React from 'react';
import { Switch, Route, BrowserRouter as Router, withRouter } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import Login from './Components/Login';
import Events from './Components/Events';
import NotFound from './Components/NotFound';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Header>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/events" component={Events} />
            <Route component={NotFound} />
          </Switch>
        </Header>
      </Router>
    );
  }
}

export default withRouter(App);
