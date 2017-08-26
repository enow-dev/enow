import React from 'react';
import { Switch, Route, BrowserRouter as Router, withRouter } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import Events from './Components/Events';

class App extends React.Component {
  render() {
    return (
      <Header>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/events" component={Events} />
          </Switch>
        </Router>
      </Header>
    );
  }
}

export default withRouter(App);
