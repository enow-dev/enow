import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import SearchBox from './SearchBox';

const styles = {
  container: {
    width: '100%',
    height: '50%',
    margin: 0,
    padding: 10,
  },
  item: {
    width: '80%',
    height: '50%',
  },
  message: {
    padding: 20,
  },
};

function NotFound({ classes, history }) {
  return (
    <Grid
      container
      className={classes.container}
      align="center"
      direction="column"
      justify="center"
    >
      <Grid item className={classes.item}>
        <Paper elevation={4}>
          <div className={classes.message}>
            <Typography gutterBottom type="display1">お探しのページは見つかりませんでした。</Typography>
            <Typography type="headline">他のイベントを探してみませんか？</Typography>
          </div>
          <SearchBox handleSubmit={() => { history.push('/events'); }} />
        </Paper>
      </Grid>
    </Grid>
  );
}

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
NotFound.defaultProps = {
  classes: Object,
  history: PropTypes.shape({
    push: () => {},
  }).isRequired,
};

export default withStyles(styles)(NotFound);
