import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { grey, orange } from 'material-ui/colors';
import MediaQuery from 'react-responsive';

import * as AouthActions from '../Actions/Aouth';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  headerAppBar: {

  },
  subheader: {
    borderBottom: `solid 1px ${grey[500]}`,
  },
});

function SubHeader({classes}) {
  return (
    <Toolbar className={classes.subheader}>
      <Grid container direction="row" align="center" justify="space-around">
        <Grid item>
          <Button raised>検索する</Button>
        </Grid>
        <Grid>
          <Button raised>マイページ</Button>
        </Grid>
      </Grid>
    </Toolbar>
  );
}

class Header extends React.Component {
  aouthAction = () => {
    const { aouthActions } = this.props;
    aouthActions.startAouthGithub();
  };

  render() {
    console.log(this.props);
    const { classes, children, aouth } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.headerAppBar}>
          <Toolbar>
            <Typography
              type="display3"
              style={{ lineHeight: 0, marginBottom: 10, color: `${orange[500]}`, letterSpacing: 2 }}
            >
              e
            </Typography>
            <Typography type="display1" style={{ letterSpacing: 2 }}>
              now
            </Typography>
            <Typography type="title" style={{ marginLeft: 20, marginTop: 10 }}>
              IT勉強会・イベント検索
            </Typography>
            {
              aouth.isAouthing ? null : <Button onClick={this.aouthAction}>Github</Button>
            }
          </Toolbar>
        </AppBar>
        <MediaQuery query="(max-width:1024px)">
          <SubHeader />
        </MediaQuery>
        {children}
      </div>
    );
  }
}
Header.propTypes = {
  classes: styles,
  children: PropTypes.node,
};
Header.defaultProps = {
  classes: styles,
  children: null,
};
SubHeader.propTypes = {
  classes: styles,
};
SubHeader.defaultProps = {
  classes: styles,
};

const mapStateToProps = state => ({
  aouth: state.aouth,
});
const mapDispatchToProps = dispatch => ({
  aouthActions: bindActionCreators(AouthActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header));
