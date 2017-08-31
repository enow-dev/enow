import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Card, { CardContent } from 'material-ui/Card';
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui/List';
import EventIcon from 'material-ui-icons/Event';
import LocationONIcon from 'material-ui-icons/LocationOn';
import SupervisorAccount from 'material-ui-icons/SupervisorAccount';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import { grey, blue } from 'material-ui/colors';
import dateFormat from 'dateformat';
import KeyboardArrowUp from 'material-ui-icons/KeyboardArrowUp';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';

import * as EventActions from '../Actions/Event';
import propviderInfo from '../Constants/Provider';

const styles = theme => ({
  cardTitle: {
    width: '100%',
    padding: 10,
    margin: 0,
  },
  cardTitleHover: {
    padding: 10,
    color: blue[500],
  },
  button: {
    border: `solid 1px ${grey[300]}`,
    borderRadius: '10px',
    backgroundColor: `${grey[300]}`,
    color: `${grey[700]}`,
  },
  noFavoriteButton: {
    border: `solid 1px ${theme.palette.primary.A700}`,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  favoriteButton: {
    border: `solid 1px ${theme.palette.primary.A700}`,
    borderRadius: 10,
    backgroundColor: `${theme.palette.primary.A700}`,
  },
});

class EventBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDrawer: false,
      isOpenedDrawer: false,
      eventDetail: null,
      isTitleHover: false,
      isFavorite: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.detail == null) {
      return;
    }
    if (nextProps.detail.item.id === this.props.event.id) {
      this.setState({ eventDetail: nextProps.detail, isOpenDrawer: true, isOpeedDrawer: false });
    }
  }

  handleCloseDrawer = () => {
    this.setState({ isOpenDrawer: false });
  };

  handleOpenDrawer() {
    if (this.state.isOpenDrawer) {
      this.setState({ isOpenDrawer: false });
      return;
    }
    const { actions, event } = this.props;
    if (this.state.isOpenedDrawer === false) {
      actions.getEventIfNeeded(event.id);
    }
  }

  renderDrawer() {
    return (
      <div>
        <ListItem>
          <div dangerouslySetInnerHTML={{ __html: `${this.state.eventDetail.item.description}` }} />
        </ListItem>
        <ListItem button onClick={this.handleCloseDrawer}>
          <Grid container align="center" direction="row" justify="center">
            <Grid item>
              <KeyboardArrowUp />
            </Grid>
          </Grid>
        </ListItem>
      </div>
    );
  }

  render() {
    const { classes, event, handleEditJump, handleProviderJump } = this.props;
    const startDate = new Date(event.startAt);
    const endDate = new Date(event.endAt);
    let title = String(event.title);
    if (title.length > 36) {
      title =`${ title.substr(0,36)}...`
    }
    let logoUrl = null;
    propviderInfo.map(item => {
      if (event.apiId === item.id) {
        logoUrl = item.logoUrl;
      }
    });
    return (
      <Card>
        <Grid
          container
          className={classes.cardTitle}
          align="center"
          direction="row"
          justify="space-between"
          spacing={24}
        >
          <Grid item>
        <Typography
          className={this.state.isTitleHover ? classes.cardTitleHover : classes.cardTitle}
          type="headline"
          component="a"
          href="#"
          align="left"
          onClick={() => {
            handleEditJump(event);
            return false;
          }}
          onMouseEnter={() => {
            this.setState({ isTitleHover: true });
          }}
          onMouseLeave={() => {
            this.setState({ isTitleHover: false });
          }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          className={
            this.state.isFavorite ? classes.favoriteButton : classes.noFavoriteButton
          }
          dense
          onClick={() => {
            this.setState({ isFavorite: !this.state.isFavorite });
          }}
        >
          {this.state.isFavorite ? 'お気に入り中' : 'お気に入りする'}
        </Button>
      </Grid>
      </Grid>
        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText
                primary={`${dateFormat(startDate, 'yyyy/mm/dd')} ~ ${dateFormat(endDate, 'mm/dd')}`}
              />
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
              <Grid container direction="row" justify="flex-start" align="center">
                {event.tags.map(item =>
                  <Grid item>
                    <Button dense className={classes.button}>
                      {item}
                    </Button>
                  </Grid>,
                )}
              </Grid>
            </ListItem>
            <Divider />
            <ListItem>
              <Grid container direction="row" justify="space-between" align="center">
                <Grid item>
                  <Button
                    dense
                    className={classes.button}
                    onClick={() => {
                      this.handleOpenDrawer();
                    }}
                  >
                    {this.state.isOpenDrawer ? '閉じる' : '詳細を見る'}
                  </Button>
                </Grid>
                <Grid item>
                  <ListItemSecondaryAction>
                    <IconButton
                      style={{ width: 100 }}
                      onClick={() => {
                        handleProviderJump(event);
                      }}
                    >
                      <img style={{ width: 100 }} src={`${logoUrl}`} alt="提供元ロゴ"/>
                    </IconButton>
                  </ListItemSecondaryAction>
                </Grid>
              </Grid>
            </ListItem>
            {this.state.isOpenDrawer ? this.renderDrawer() : null}
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

const mapStateToProps = state => ({
  detail: state.event,
  error: state.error,
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(EventActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EventBox));
