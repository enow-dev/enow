import React from 'react';
import { withStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as EventsActions from '../Actions/Events';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { grey, blue } from 'material-ui/colors';
import MediaQuery from 'react-responsive';

import EventsTab from './EventsTab';
import EventBox from './EventBox';
import GithubIcon from '../icons/github.svg';
import FacebookIcon from '../icons/facebook.svg';
import SearchBox from './SearchBox';

const styles = theme => ({
  root: {
    backgroundColor: grey[100],
  },
  centerProgressItem: {
    marginTop: '20px',
  },
  tabsClass: {
    backgroundColor: theme.palette.primary.A700,
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
  createAccountContainer: {},
  createAccountItem: {
    width: '80%',
  },
  createAccountPR: {
    color: `${blue[600]}`,
  },
  githubIcon: {
    width: '30px',
    height: '30px',
    position: 'absolute',
    left: 3,
    top: 3,
    borderRight: `solid 1px ${grey[500]}`,
    paddingRight: '10px',
  },
  faceBookIcon: {
    width: '30px',
    height: '30px',
    position: 'absolute',
    left: 3,
    top: 3,
    borderRight: `solid 1px ${grey[500]}`,
    paddingRight: '10px',
  },
  oathButton: {
    width: '100%',
    padding: '10px',
    color: `#fff`,
  },
  webRoot: {
    marginTop: '10px',
  },
  webSearchBox: { border: `solid 1px ${theme.palette.primary.A700}` },
});
class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectTabIndex: 0,
      isLoading: false,
      events: [1, 2, 3, 4],
    };
  }
  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({ isLoading: false });
    // }, 5000);
    this.props.actions.getEventsIfNeeded(false, false);
  }

  handleTabChange = (event, value) => {
    this.setState({ selectTabIndex: value });
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
  handleEdit = event => {
    window.location.href = event.url;
  }
  renderEventsBox() {
    const { events } = this.props;
    return events.list.map(item => <EventBox event={item}/>);
  }
  renderMoreRead() {
    const { classes } = this.props;
    return (
      <Grid
        container
        className={classes.moreReadContainer}
        align="center"
        direction="row"
        justify="center"
      >
        <Grid item className={classes.moreReadItem} align="center" direction="row" justify="center">
          <Button className={classes.moreReadButton}>続きを読み込む</Button>
        </Grid>
      </Grid>
    );
  }
  renderCreateAccount() {
    const { classes } = this.props;
    return (
      <Grid
        container
        align="center"
        direction="row"
        justify="center"
        className={classes.createAccountContainer}
      >
        <Grid item className={classes.createAccountItem}>
          <Typography type="subheading" className={classes.createAccountPR}>
            昨日見た情報は検索結果に出ませんが 複数端末で出ないようにするには
          </Typography>
          <Typography type="subheading">アカウント作成で実現出来ます</Typography>
        </Grid>
        <Grid
          item
          style={{
            backgroundColor: `${grey[800]}`,
            padding: '3px',
            borderRadius: '10px',
            marginBottom: '10px',
          }}
          className={classes.createAccountItem}
        >
          <div style={{ width: '100%', position: 'relative', display: 'inline-block' }}>
            <img src={GithubIcon} className={classes.githubIcon} alt="Github" />
            <Button className={classes.oathButton}>Sigin In Github</Button>
          </div>
        </Grid>
        <Grid
          item
          style={{ backgroundColor: `${blue[800]}`, padding: '3px', borderRadius: '10px' }}
          className={classes.createAccountItem}
        >
          <div style={{ width: '100%', position: 'relative', display: 'inline-block' }}>
            <img src={FacebookIcon} className={classes.faceBookIcon} alt="Facebook" />
            <Button className={classes.oathButton}>Sigin In Facebook</Button>
          </div>
        </Grid>
      </Grid>
    );
  }

  renderMainNative() {
    return (
      <Grid container spacing={40} align="center" direction="column" justify="center">
        <Grid item>
          {this.renderEventsBox()}
        </Grid>
        <Grid item style={{ width: '100%' }}>
          {this.renderMoreRead()}
        </Grid>
        <Grid item>
          {this.renderCreateAccount()}
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <SearchBox />
        </Grid>
      </Grid>
    );
  }
  renderMainWeb() {
    const { classes } = this.props;
    return (
      <Grid
        container
        className={classes.webRoot}
        spacing={24}
        align="flex-start"
        direction="row"
        justify="center"
      >
        <Grid item xs={3}>
          <SearchBox rootClass={classes.webSearchBox} />
        </Grid>
        <Grid item xs={8}>
          {this.renderEventsBox()}
        </Grid>
      </Grid>
    );
  }
  renderMain() {
    return (
      <div>
        <MediaQuery query="(max-width: 1024px)">
          {this.renderMainNative()}
        </MediaQuery>
        <MediaQuery query="(min-width: 1025px)">
          {this.renderMainWeb()}
        </MediaQuery>
      </div>
    );
  }

  render() {
    const { classes,events } = this.props;
    return (
      <div className={classes.root}>
        <EventsTab
          appBarClass={classes.tabsClass}
          selectTabIndex={this.state.selectTabIndex}
          handleTabChange={this.handleTabChange}
        />
      {events.isFetching ? this.renderCenterProgress() : this.renderMain()}
      </div>
    );
  }
}
const EventWwapped = withStyles(styles)(Events);

const mapStateToProps = state => ({
  events: state.events,
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(EventsActions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EventWwapped));
