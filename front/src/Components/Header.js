import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { grey } from 'material-ui/colors';

const styles = {
  root: {
    width: '100%',
    height: '100%',
  },
  subheader: {
    borderBottom: `solid 1px ${grey[500]}`,
  },
  flex: {
    flex: 1,
  },
};

class Header extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className={classes.flex}>
              enow
            </Typography>
            IT勉強会・イベント検索
          </Toolbar>
        </AppBar>
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
        {this.props.children}
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.shape({
      width: PropTypes.string,
    }),
    flex: PropTypes.shape({
      flex: PropTypes.number,
    }),
  }),
  children: PropTypes.element.isRequired,
};

Header.defaultProps = {
  classes: styles,
};

export default withStyles(styles)(Header);
