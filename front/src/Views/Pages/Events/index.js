import React from 'react';
import { withStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import Card, { CardHeader } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { grey, blue } from 'material-ui/colors';
import MediaQuery from 'react-responsive';
import { StickyContainer, Sticky } from 'react-sticky';

import * as EventsActions from '../../../Actions/Events';
import * as FavoriteEventsActions from '../../../Actions/FavoriteEvents';
import Header from '../../Components/Header';
import EventsTab from '../../Components/EventsTab';
import EventBox from '../../Components/EventBox';
import GithubIcon from '../../icons/github.svg';
import FacebookIcon from '../../icons/facebook.svg';
import SearchBox from '../../Components/SearchBox';

import EventDetail from '../EventDetail';

import Web from './Web';
import Native from './Native';

const styles = theme => ({
  root: {
    backgroundColor: grey[100],
    width: '100%',
    margin: 0,
  },
  centerProgressItem: {
    marginTop: '20px',
  },
  tabsClass: {
    backgroundColor: theme.palette.primary,
    color: '#fff',
  },
  moreReadContainer: {
    paddingTop: '20px',
  },
  moreReadItem: {
    width: '80%',
  },
  moreReadButton: {
    width: '100%',
    border: `solid 1px ${grey[300]}`,
    borderRadius: '10px',
    backgroundColor: `${grey[300]}`,
    color: `${grey[700]}`,
  },
});
class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectTabIndex: 0,

    };
  }

  handleTabChange = (event, value) => {
    this.setState({ selectTabIndex: value });
    const { eventsActions, favoriteEventsActions } = this.props;
    eventsActions.clearEvents();
    switch (value) {
      case 3:
        favoriteEventsActions.getFavoriteEventsIfNeeded(false);
        break;
      default:
        break;
    }
  };

  renderCenterProgress() {
    const { classes } = this.props;
    return (
      <Grid container align="center" direction="row" justify="center">
        <Grid item className={classes.centerProgressItem}>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  handleEditJump = event => {
     const { history, match } = this.props;
     history.push(`${match.url}/${event.id}`);
  }

  handleProviderJump = event => {
    window.open(
      event.item.url,
      '_blank',
    );
  }

  renderEventsBox() {
    const { events } = this.props;
    if (events.list.length === 0) {
      return (
        <Grid item style={{ width: '100%' }}>
          <Card>
            <CardHeader
              title="お探しのイベントはありませんでした。" />
          </Card>
        </Grid>
      )
    }
    return events.list.map((item,index) =>
      <Grid item key={index} style={{ width: '100%' }}>
        <EventBox event={item} handleEditJump={this.handleEditJump} handleProviderJump={this.handleProviderJump}/>
      </Grid>,
    );
  }

  handleMoreRead = () => {
    const { eventsActions, events } = this.props;
    eventsActions.moreReadEventsIfNeeded(false, false, events.link );
  };

  renderMoreRead() {
    const { classes, events } = this.props;
    if (!events.link) {
      return null;
    }
    return (
      <Grid
        container
        className={classes.moreReadContainer}
        align="center"
        direction="row"
        justify="center"
      >
        <Grid item className={classes.moreReadItem}>
          <Button className={classes.moreReadButton} onClick={this.handleMoreRead}>
            続きを読み込む
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderMain() {
    const { events } = this.props;
    return (
      <div>
        <MediaQuery query="(max-width: 1024px)">
          <Native
            isMoreFetching={events.isMoreFetching}
            eventListComponent={this.renderEventsBox()}
            progressComponent={this.renderCenterProgress()}
            moreReadComponent={this.renderMoreRead()}
          />
        </MediaQuery>
        <MediaQuery query="(min-width: 1025px)">
          <Web
            isMoreFetching={events.isMoreFetching}
            eventListComponent={this.renderEventsBox()}
            progressComponent={this.renderCenterProgress()}
            moreReadComponent={this.renderMoreRead()}
          />
        </MediaQuery>
      </div>
    );
  }
  renderComponent = () => {
    const { classes, events } = this.props;
    return (
      <div className={classes.root}>
        <Header tabsChildren={<EventsTab selectTabIndex={this.state.selectTabIndex} handleTabChange={this.handleTabChange} />}/>
        {events.isFetching ? this.renderCenterProgress() : this.renderMain()}
      </div>
    );
  };
  render() {
    return (
      <Switch>
        <Route　exact path={`${this.props.match.url}`} render={this.renderComponent} />
        <Route path={`${this.props.match.url}/:id`} component={EventDetail} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events,
});
const mapDispatchToProps = dispatch => ({
  eventsActions: bindActionCreators(EventsActions, dispatch),
  favoriteEventsActions: bindActionCreators(FavoriteEventsActions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Events)));
