import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';

import Header from '../Components/Header';

import * as AouthActions from '../../Actions/Aouth';



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
    this.startAouth();
  }

  startAouth = () => {
    const { aouthActions } = this.props;
    aouthActions.startAouthGithub();
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
    const { aouth, history } = nextProps;
    if (aouth.isAouth) {
      history.replace('/');
      return false;
    }
    return true;
  }
  render() {
    const {aouth, aouthActions} = this.props;
    aouthActions.checkAouth();
    return  aouth.isFetching ? (
      <div>
        <Header />
        {this.renderCenterProgress()}
      </div>
    ) :null;
  }
}
const mapStateToProps = state => ({
  aouth: state.aouth,
});
const mapDispatchToProps = dispatch => ({
  aouthActions: bindActionCreators(AouthActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
