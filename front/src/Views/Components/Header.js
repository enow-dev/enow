import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { grey, orange } from 'material-ui/colors';
import MediaQuery from 'react-responsive';
import Avatar from 'material-ui/Avatar';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';

import FacebookIcon from '../icons/facebook.svg';
import GithubIcon from '../icons/github.svg';
import * as AouthActions from '../../Actions/Aouth';
import * as SearchStashActions from '../../Actions/SearchStash';

const styles = theme => ({

  root: {
    width: '100%',
    height: '100%',
  },
  headerAppBar: {
    color: '#fff',

  },
  subheader: {
    borderBottom: `solid 1px ${grey[500]}`,
  },
  accountCircleIcon: {
    width: 38,
    height: 38,
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

function AccountDialog({classes, aouthActions, isOpen, onRequestClose, isGithubAouth, isFacebookAouth}){
  return (
    <Dialog open={isOpen}>
      <DialogTitle>ログイン</DialogTitle>
      <div>
        <List>

          <ListItem button onClick={()=>{
              !isGithubAouth ?
              aouthActions.startAouthGithub() :
              aouthActions.logout() ;
              onRequestClose();
            }}>
            <ListItemAvatar>
              <Avatar src={GithubIcon} style={{backgroundColor: 'black'}}/>
            </ListItemAvatar>
            <ListItemText primary={isGithubAouth ? "ログアウント" : "Githubでログイン"} />
          </ListItem>
          <ListItem button onClick={()=>{
            !isFacebookAouth ?
            aouthActions.startOauthFacebook() :
            aouthActions.logout() ;
            onRequestClose();
            }}>
            <ListItemAvatar>
              <Avatar src={FacebookIcon} style={{backgroundColor: 'blue'}} />
            </ListItemAvatar>
            <ListItemText primary="Facebookでログイン" />
          </ListItem>
          <ListItem button onClick={()=>{onRequestClose()}}>
            <ListItemText primary="キャンセル" />
          </ListItem>
        </List>
      </div>
    </Dialog>
  );
}

class Header extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isAccountDialogOpen: false,
    }
  }

  componentWillMount() {
    const { searchStashActions } = this.props;
    searchStashActions.isCookieST();
  }

  handleClickAvatar = () => {
    this.setState({ isAccountDialogOpen: !this.state.isAccountDialogOpen });
  }
  renderAvatarIcon() {
    const { aouth, classes } = this.props;
    if (aouth.isAouth) {
      return (
        <Avatar
          alt="Adelle Charles"
          src={`${aouth.info.avaterUrl}`}
        />
      );
    } else {
      return (
        <AccountCircleIcon className={classes.accountCircleIcon}/>
      )
    }
  }

  handleRequestClose = () => {
    this.setState({ isAccountDialogOpen: false });
  }

  jumpHome = () => {
    const { history } = this.props;
    history.push('/');
  }

  render() {
    const { classes, children, aouth, aouthActions, tabsChildren } = this.props;
    const { REACT_APP_ClientID, REACT_APP_API_Scheme, REACT_APP_API_Host, REACT_APP_FRONT_Host } = process.env;
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.headerAppBar}>
          <Toolbar>
            <Grid container direction="row" align="center" justify="space-between">
              <Grid item>
                <div
                  style={{cursor: 'pointer'}}
                  onClick={this.jumpHome}>
                  <Grid container direction="row" align="center" justify="flex-start" spacing={0}>
                    <Grid item>
                      <Typography
                        type="display3"
                        style={{ lineHeight: 0, marginBottom: 10, color: `${orange[500]}`, letterSpacing: 2 }}
                      >
                        e
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography type="display1" style={{ letterSpacing: 2, color: 'inherit' }}>
                        now
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography type="title" style={{ marginLeft: 20, marginTop: 10, color: 'inherit'}}>
                        IT勉強会・イベント検索
                      </Typography>
                    </Grid>
                    {`ClientID=${REACT_APP_ClientID}、API_Scheme=${REACT_APP_API_Scheme}、API_Host=${REACT_APP_API_Host}、Front_Host=${REACT_APP_FRONT_Host}`}
                  </Grid>
                  </div>
              </Grid>
              <Grid item>
                <div
                  style={{cursor: 'pointer'}}
                  onClick={this.handleClickAvatar}>
                  { this.renderAvatarIcon() }
                </div>
              </Grid>
            </Grid>
          </Toolbar>
          { tabsChildren ? tabsChildren : null }
        </AppBar>
        <MediaQuery query="(max-width:1024px)">
          <SubHeader classes={classes}/>
        </MediaQuery>
        <AccountDialog
          isGithubAouth={aouth.isAouth}
          isOpen={this.state.isAccountDialogOpen}
          aouthActions={aouthActions}
          onRequestClose={this.handleRequestClose}/>
        {children}
      </div>
    );
  }
}
Header.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
};
Header.defaultProps = {
  classes: Object,
  children: null,
};
SubHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};
SubHeader.defaultProps = {
  classes: Object,
};

const mapStateToProps = state => ({
  aouth: state.aouth,
});
const mapDispatchToProps = dispatch => ({
  aouthActions: bindActionCreators(AouthActions, dispatch),
  searchStashActions: bindActionCreators(SearchStashActions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header)));
