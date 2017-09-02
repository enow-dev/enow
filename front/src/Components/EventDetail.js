import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';

import Grid from 'material-ui/Grid';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import * as EventActions from '../Actions/Event';

const styles = {
  root: {
    width: '100%',
    height: '100%',
  },
  item: {
    width: '80%',
  },
};
function getStyleUrl() {
  let extDefStyle = process.env.REACT_APP_API_extDefStyle;
  if (extDefStyle == null) {
    extDefStyle = process.env.extDefStyle;
  }
  return extDefStyle;
}
class EventDetail extends React.Component {
  componentDidMount() {
    const { actions, match } = this.props;
    actions.getEventIfNeeded(match.params.id);
  }
  componentWillReceiveProps() {
    const { error, history } = this.props;
    if (error.isError) {
      history.push('/');
    }
  }
  renderMain() {
    const { classes } = this.props;
    const { item } = this.props.event;
    let startDateFormat = '';
    if (item.startAt !== '') {
      const startDate = new Date(item.startAt);
      startDateFormat = dateFormat(startDate, 'yyyy/mm/dd');
    }
    let endDateFormat = '';
    if (item.endAt !== '') {
      const endDate = new Date(item.endAt);
      endDateFormat = dateFormat(endDate, 'mm/dd');
    }
    const styleUrl = getStyleUrl();
    return (
      <Grid
        container
        className={classes.root}
        align="center"
        direction="column"
        justify="flex-start"
      >
        <Grid item className={classes.item}>
          <Card>
            <CardHeader title={item.title} subheader={`${item.place} ${startDateFormat} ~ ${endDateFormat}`} />
            <CardContent>
              <link rel="stylesheet" type="text/css" href={`${styleUrl}/innerHTML.css`} />
              <div
                className={classes.innerHTML}
                dangerouslySetInnerHTML={{ __html: `${item.description}` }}
              />
              <Typography type="body2">{item.address}</Typography>
              <a href={`${item.url}`}>イベントページ</a>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
  renderEmpty() {
    return null;
  }
  render() {
    const { error } = this.props;
    if (error.isError) {
      return this.renderEmpty();
    }
    return this.renderMain();
  }
}

EventDetail.propTypes = {
  actions: PropTypes.shape({
    getEventIfNeeded: PropTypes.func.isRequired,
  }),
  match: Object,
  classes: Object,
  event: PropTypes.shape({
    item: PropTypes.object.isRequired,
  }),
};
EventDetail.defaultProps = {
  actions: {
    getEventIfNeeded: null,
  },
  match: {},
  classes: styles,
  event: {
    item: {
      title: '',
      place: '',
      startAt: '',
      endAt: '',
      description: '',
      address: '',
      url: '',
    },
  },
};

const mapStateToProps = state => ({
  event: state.event,
  error: state.error,
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(EventActions, dispatch),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EventDetail)),
);
