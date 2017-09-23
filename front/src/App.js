import React from 'react';
import { Switch, Route, BrowserRouter as Router, withRouter } from 'react-router-dom';
import OAuth from './Views/Components/OAuth';
import Home from './Views/Pages/Home';
import Login from './Views/Pages/Login';
import Events from './Views/Pages/Events/';
import NotFound from './Views/Pages/NotFound';

class App extends React.Component {
  render() {
    return (
      <OAuth>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/events" component={Events} />
            <Route path="/NotFound" component={NotFound} />
            {/* <Route component={NotFound} /> */}
          </Switch>
        </Router>
      </OAuth>
    );
  }
}

export default withRouter(App);
