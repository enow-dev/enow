import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

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
import { grey, blue, orange } from 'material-ui/colors';
import dateFormat from 'dateformat';
import KeyboardArrowUp from 'material-ui-icons/KeyboardArrowUp';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import FavoriteIcon from 'material-ui-icons/Favorite';

import propviderInfo from '../../Constants/Provider';

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
    minWidth: 200,
    border: `solid 1px ${orange[500]}`,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: '15px 30px',
    color: orange[500],
  },
  favoriteButton: {
    minWidth: 200,
    border: `solid 1px ${orange[500]}`,
    borderRadius: 10,
    backgroundColor: `${orange[500]}`,
    padding: '15px 30px',
    color: '#fff',
  },
  favoriteIcon : {
    width: 25,
    height: 25,
    position: 'absolute',
    left: 10,
    top: 10,
    fill: '#fff',
    zIndex: 1,
  },
  noFavoriteIcon: {
    width: 25,
    height: 25,
    position: 'absolute',
    left: 5,
    top: 10,
    fill: orange[500],
    zIndex: 1,
  }
});

class EventBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDrawer: false,
      isOpenedDrawer: false,
      favorite: null,
      isTitleHover: false,
      isFavorite: props.event.item.isFavorite ? props.event.item.isFavorite : false,
    };
  }

  handleCloseDrawer = () => {
    this.setState({ isOpenDrawer: false });
  };

  handleOpenDrawer() {
    if (this.state.isOpenDrawer) {
      this.setState({ isOpenDrawer: false });
      return;
    }
    this.setState({ isOpenDrawer: true });
    const { event, onClickEdit } = this.props;
    if (onClickEdit) {
      onClickEdit(event);
    }
  }

  renderDrawer() {
    const { event } = this.props;
    return (
      <div>
        <ListItem>
          <div dangerouslySetInnerHTML={{ __html: `${event.item.description ? event.item.description : '' }` }} />
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
    const { classes, event, handleProviderJump, onClickDeleteFavorite, onClickPutFavorite } = this.props;
    const startDate = new Date(event.item.startAt);
    const endDate = new Date(event.item.endAt);
    let title = String(event.item.title);
    if (title.length > 36) {
      title =`${ title.substr(0,36)}...`
    }
    let logoUrl = null;
    propviderInfo.some(item => {
      if (event.item['api_id'] === item.id) {
        logoUrl = item.logoUrl;
        return true;
      }
      return false;
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
                handleProviderJump(event);
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
            <div style={{ width: '100%', position: 'relative', display: 'inline-block' }}>
              <FavoriteIcon className={
                  this.state.isFavorite ? classes.favoriteIcon : classes.noFavoriteIcon
                }
              />
              <Button
                className={
                  this.state.isFavorite ? classes.favoriteButton : classes.noFavoriteButton
                }
                dense
                onClick={() => {
                  const { isFavorite } = this.state;
                  this.setState({ isFavorite: !isFavorite });
                  if (isFavorite) {
                    onClickDeleteFavorite(event);
                  } else {
                    onClickPutFavorite(event);
                  }
                }}
              >
                {this.state.isFavorite ? 'お気に入り中' : 'お気に入りに追加する'}
              </Button>
            </div>
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
              <ListItemText primary={`${event.item.area}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SupervisorAccount />
              </ListItemIcon>
              <ListItemText primary={`${event.item.accepted}人/定員${event.item.limit}人`} />
            </ListItem>
            <ListItem>
              <Grid container direction="row" justify="flex-start" align="center">
                {event.item.tags.map((item, index) =>
                  <Grid item key={index}>
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
  classes: PropTypes.object.isRequired,
  event: PropTypes.shape({
    accepted: PropTypes.number,
    limit: PropTypes.number,
  }),
};
EventBox.defaultProps = {
  classes: Object,
  event: PropTypes.shape({
    accepted: 0,
    limit: 0,
  }),
};

export default withStyles(styles)(EventBox);
