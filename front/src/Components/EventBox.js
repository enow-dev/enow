import React from 'react';
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
    const { classes } = this.props;
    return (
      <Card>
        <CardHeader title="Go Conference 2017 Spring" />
        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="2017/05/24(水)11:00 ~ 5/26(金)13:00" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationONIcon />
              </ListItemIcon>
              <ListItemText primary="東京都渋谷区" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SupervisorAccount />
              </ListItemIcon>
              <ListItemText primary="31/定員34人" />
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
                  <Button dense className={classes.button}>
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
};
EventBox.defaultProps = {
  classes: null,
};
export default withStyles(styles)(EventBox);
