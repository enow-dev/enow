import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';

import Header from '../Components/Header';

import * as OAuthActions from '../../Actions/OAuth';



const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  centerProgressItem: {
    marginTop: '20px',
  },
});

class Login extends React.Component {

  handleOnClick = () => {
    this.startOauth();
  }

  startOauth = () => {
    const { oauthActions } = this.props;
    oauthActions.startOauthGithub();
  }

  renderCenterProgress(){
    const { classes } = this.props;
    return (
      <Grid container align="center" direction="row" justify="center">
        <Grid item className={classes.centerProgressItem}>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  shouldComponentUpdate(nextProps, nextState){
    const { oauth, history } = nextProps;
    if (oauth.isOAuth) {
      history.replace('/');
      return false;
    }
    return true;
  }
  render() {
    const {oauth, oauthActions} = this.props;
    oauthActions.checkOAuth();
    return  oauth.isFetching ? (
      <div>
        <Header />
        {this.renderCenterProgress()}
      </div>
    ) :null;
  }
}
const mapStateToProps = state => ({
  oauth: state.oauth,
});
const mapDispatchToProps = dispatch => ({
  oauthActions: bindActionCreators(OAuthActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
