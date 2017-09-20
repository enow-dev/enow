import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { grey, blue } from 'material-ui/colors';

import GithubIcon from '../../icons/github.svg';
import FacebookIcon from '../../icons/facebook.svg';
import SearchBox from '../../Components/SearchBox';

const styles = {
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
    color: '#fff',
  },
};

class Native extends React.Component {
  renderCreateAccount() {
    const { classes } = this.props;
    return (
      <Grid
        container
        style={{ width: '100%' }}
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
  render() {
    const {
      isMoreFetching,
      eventListComponent,
      progressComponent,
      moreReadComponent,
    } = this.props;
    return (
      <Grid
        container
        style={{ width: '100%', margin: 0 }}
        spacing={24}
        align="center"
        direction="column"
        justify="center"
      >
        <Grid item>{eventListComponent}</Grid>
        <Grid item style={{ width: '100%' }}>
          {isMoreFetching ? progressComponent : moreReadComponent}
        </Grid>
        <Grid item style={{ width: '100%' }}>
          {isMoreFetching ? progressComponent : null}
        </Grid>
        <Grid item>{this.renderCreateAccount()}</Grid>
        <Grid item style={{ width: '100%' }}>
          <SearchBox />
        </Grid>
      </Grid>
    );
  }
}

Native.propTypes = {
  classes: PropTypes.object.isRequired,
  isMoreFetching: PropTypes.bool,
  eventListComponent: PropTypes.node,
  progressComponent: PropTypes.node,
  moreReadComponent: PropTypes.node,
};
Native.defaultProps = {
  classes: Object,
  isMoreFetching: false,
  eventListComponent: null,
  progressComponent: null,
  moreReadComponent: null,
};

export default withStyles(styles)(Native);
