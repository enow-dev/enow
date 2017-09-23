import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { StickyContainer, Sticky } from 'react-sticky';
import Grid from 'material-ui/Grid';

import SearchBox from '../../Components/SearchBox';

const styles = theme => ({
  root: {
    marginTop: 10,
  },
  searchBox: { border: `solid 1px ${theme.palette.primary.A700}` },
});

class Web extends React.Component {
  render() {
    const {
      classes,
      isMoreFetching,
      isFetching,
      eventListComponent,
      progressComponent,
      moreReadComponent,
    } = this.props;
    return (
      <StickyContainer>
        <Grid
          container
          className={classes.root}
          spacing={24}
          align="flex-start"
          direction="row"
          justify="center"
        >
          <Grid item xs={3}>
            <Sticky>
              {props => (
                <div style={props.style}>
                  <SearchBox rootClass={classes.searchBox} />
                </div>
              )}
            </Sticky>
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={8} align="flex-start" direction="row" justify="center">
              {eventListComponent}
            </Grid>
            <Grid item style={{ width: '100%' }}>
              {isMoreFetching || isFetching ? progressComponent : moreReadComponent}
            </Grid>
          </Grid>
        </Grid>
      </StickyContainer>
    );
  }
}

Web.propTypes = {
  classes: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
  isMoreFetching: PropTypes.bool,
  eventListComponent: PropTypes.node,
  progressComponent: PropTypes.node,
  moreReadComponent: PropTypes.node,
};
Web.defaultProps = {
  classes: Object,
  isFetching: false,
  isMoreFetching: false,
  eventListComponent: null,
  progressComponent: null,
  moreReadComponent: null,
};

export default withStyles(styles)(Web);
