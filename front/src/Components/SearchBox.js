import React from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import SearchIcon from 'material-ui-icons/Search';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import { grey } from 'material-ui/colors';

const styles = theme => ({
  root: {},
  paper: {
    width: '100%',
    height: '50px',
    backgroundColor: theme.palette.primary.A700,
  },
  searchItem: {
    width: '80%',
    marginLeft: 20,
  },
  searchIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    left: 3,
    top: 5,
    fill: '#fff',
  },
  searchText: {
    marginLeft: 30,
    color: '#fff',
  },
  searchForm: {
    marginTop: 20,
  },
  searchFormItem: {
    width: '80%',
  },
  selectPlaceRoot: {
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${grey[500]}`,
  },
  searchButton: {
    width: '100%',
    backgroundColor: theme.palette.primary.A700,
    border: `1px solid ${theme.palette.primary.A700}`,
    color: '#fff',
  },
});
class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedIndex: 0,
      anchorEl: undefined,
      placeList: ['大阪府', '東京', '石垣島'],
      alreadyCheck: false,
    };
  }
  handleClickPlace = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, open: false });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };
  handleChangeAleady = (event, checked) => {
    this.setState({ alreadyCheck: checked });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper elevation={0} className={classes.paper}>
          <Grid container align="center" direction="row" justify="flex-start">
            <Grid item className={classes.searchItem}>
              <div style={{ width: '100%', position: 'relative', display: 'inline-block' }}>
                <SearchIcon className={classes.searchIcon} />
                <TextField fullWidth placeholder="検索" className={classes.searchText} />
              </div>
            </Grid>
          </Grid>
        </Paper>
        <Grid
          container
          className={classes.searchForm}
          align="center"
          direction="column"
          justify="center"
        >
          <Grid item className={classes.searchFormItem}>
            <TextField fullWidth placeholder="キーワード（PHP,UX）サジェスト？" />
          </Grid>
          <Grid item className={classes.searchFormItem}>
            <TextField fullWidth placeholder="開催日 From（自動的に入れる）" />
          </Grid>
          <Grid item className={classes.searchFormItem}>
            <div className={classes.selectPlaceRoot}>
              <List>
                <ListItem
                  button
                  aria-haspopup="true"
                  aria-controls="lock-menu"
                  aria-label="When device is locked"
                  onClick={this.handleClickPlace}
                >
                  <ListItemText
                    primary={`${this.state.placeList[this.state.selectedIndex]}(IP,cookieから自動取得）`}
                  />
                </ListItem>
              </List>
              <Menu
                id="lock-menu"
                anchorEl={this.state.anchorEl}
                open={this.state.open}
                onRequestClose={this.handleRequestClose}
              >
                {this.state.placeList.map((option, index) =>
                  <MenuItem
                    key={option}
                    selected={index === this.state.selectedIndex}
                    onClick={event => this.handleMenuItemClick(event, index)}
                  >
                    {option}
                  </MenuItem>,
                )}
              </Menu>
            </div>
          </Grid>
          <Grid item className={classes.searchFormItem}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.alreadyCheck}
                    onChange={this.handleChangeAleady}
                    value="Aleady Check"
                  />
                }
                label="既読イベントを表示する"
              />
            </FormGroup>
          </Grid>
          <Grid item className={classes.searchFormItem}>
            <Button className={classes.searchButton}>検索する</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(SearchBox);
