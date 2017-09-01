import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { grey } from 'material-ui/colors';
import MediaQuery from 'react-responsive';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  headerAppBar: {
    backgroundColor: theme.palette.primary.A700,
  },
  subheader: {
    borderBottom: `solid 1px ${grey[500]}`,
  },
});

function SubHeader({ classes }) {
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
function Header({ classes, children }) {
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.headerAppBar}>
        <Toolbar>
          <Typography type="display3">
            e
          </Typography>
          <Typography type="display1">
            now
          </Typography>
          <Typography type="title">
            IT勉強会・イベント検索
          </Typography>
        </Toolbar>
      </AppBar>
      <MediaQuery query="(max-width:1024px)">
        <SubHeader />
      </MediaQuery>
      {children}
    </div>
  );
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
export default withStyles(styles)(Header);
