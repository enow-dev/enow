import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { grey, blue } from 'material-ui/colors';

import EventsTab from './EventsTab';
import EventBox from './EventBox';
import GithubIcon from '../icons/github.svg';
import FacebookIcon from '../icons/facebook.svg';
import SearchBox from './SearchBox';

const styles = {
  root: {},
  centerProgressItem: {
    marginTop: '20px',
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
};
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
  renderEventsBox() {
    return this.state.events.map(item => <EventBox />);
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
  renderMain() {
    return (
      <Grid container spacing={40} align="center" direction="column" justify="center">
        <Grid item>
          {this.renderEventsBox()}
        </Grid>
        <Grid item style={{ width: '100%' }}>
          {this.renderMoreRead()}
        </Grid>
        <Grid itme>
          {this.renderCreateAccount()}
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <SearchBox />
        </Grid>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <EventsTab
          selectTabIndex={this.state.selectTabIndex}
          handleTabChange={this.handleTabChange}
        />
        {this.state.isLoading ? this.renderCenterProgress() : this.renderMain()}
      </div>
    );
  }
}

export default withStyles(styles)(Events);
