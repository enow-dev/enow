import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ErrorActions from '../Actions/Error';
const styles = {
  root: {
    height: '100%',
  },
};

class Home extends React.Component {
  constructor(props){
    super(props);
    props.actions.removeError();
  }
  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root} align="center" direction="column" justify="center">
        <Grid item>
          <Card>
            <CardContent>
              <CardHeader title="IT系勉強会・イベント検索" subheader="クリエイターのみなさん朗報です<br />昨日見た情報は検索結果に出ません" />
              <TextField fullWidth />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  classes: styles,
};

Home.defaultProps = {
  classes: styles,
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ErrorActions, dispatch),
});

export default connect(null, mapDispatchToProps)(withStyles(styles)(Home));
