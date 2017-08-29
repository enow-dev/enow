import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import EventIcon from 'material-ui-icons/Event';
import LocationONIcon from 'material-ui-icons/LocationOn';
import SupervisorAccount from 'material-ui-icons/SupervisorAccount';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import { grey } from 'material-ui/colors';
import dateFormat from 'dateformat';

const styles = {
  button: {
    border: `solid 1px ${grey[300]}`,
    borderRadius: '10px',
    backgroundColor: `${grey[300]}`,
    color: `${grey[700]}`,
  },
};

class EventBox extends React.Component {
  render() {
    const { classes, event, handleEdit } = this.props;
    const startDate = new Date(event.startAt);
    const endDate = new Date(event.endAt);
    return (
      <Card>
        <CardHeader title={`${event.title}`} />
        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary={`${dateFormat(startDate, 'yyyy/mm/dd')} ~ ${dateFormat(endDate, 'mm/dd')}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationONIcon />
              </ListItemIcon>
              <ListItemText primary={`${event.place}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SupervisorAccount />
              </ListItemIcon>
              <ListItemText primary={`${event.accepted}人/定員${event.limit}人`} />
            </ListItem>
            <ListItem>
              <Grid container direction="row" justify="flex-star" align="center">
                <Grid item>
                  <Button dense className={classes.button}>
                    PHP
                  </Button>
                </Grid>
                <Grid item>
                  <Button dense className={classes.button}>
                    JavaScript
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
            <ListItem>
              <Grid container direction="row" justify="space-between" align="center">
                <Grid item>
                  <Button dense className={classes.button} onClick={() => { handleEdit(event); }}>
                    詳細を見る
                  </Button>
                </Grid>
                <Grid item>
                  <Button dense className={classes.button}>
                    Compass
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  }
}
EventBox.propTypes = {
  classes: Object,
  event: PropTypes.shape({
    startAt: PropTypes.string.isRequired,
    endAt: PropTypes.string.isRequired,
    place: PropTypes.string.isRequired,
    accepted: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
  }),
};
EventBox.defaultProps = {
  classes: null,
  event: PropTypes.shape({
    startAt: '',
    endAt: '',
    place: '',
    accepted: 0,
    limit: 0,
  }),
};
export default withStyles(styles)(EventBox);
