import React from 'react';
import { Switch, Route, BrowserRouter as Router, withRouter } from 'react-router-dom';
import Aouth from './Views/Components/Aouth';
import Home from './Views/Pages/Home';
import Login from './Views/Pages/Login';
import Events from './Views/Pages/Events/';
import NotFound from './Views/Pages/NotFound';

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
            {/* <Route component={NotFound} /> */}
          </Switch>
        </Router>
      </Aouth>
    );
  }
}

export default withRouter(App);
