import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import SearchIcon from 'material-ui-icons/Search';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import { grey } from 'material-ui/colors';

import PrefMenu from './PrefMenu';

import * as EventsActions from '../Actions/Events';

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
    marginTop: 10,
    marginLeft: 30,
    color: '#fff',
  },
  searchForm: {
    width: '100%',
    paddingTop: 20,
    margin: 0,
    backgroundColor: '#fff',
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
      keyword: '',
      selectedIndex: 0,
      alreadyCheck: false,
    };
  }

  handleChangeAleady = (event, checked) => {
    this.setState({ alreadyCheck: checked });
  };
  handleChangeKeyword = (event) => {
    this.setState({keyword: event.target.value})
  }
  handleSubmit = () => {
    const { eventsAction, handleSubmit } = this.props;
    const { alreadyCheck, keyword, selectedIndex } = this.state;
    if(handleSubmit){
      handleSubmit();
    }
    eventsAction.getEventsIfNeeded(false, alreadyCheck, keyword, selectedIndex);
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={this.props.rootClass}>
        <Paper elevation={0} className={classes.paper}>
          <Grid
            container
            style={{ margin: 0, width: '100%' }}
            align="center"
            direction="row"
            justify="flex-start"
          >
            <Grid item className={classes.searchItem}>
              <div style={{ width: '100%', position: 'relative', display: 'inline-block' }}>
                <SearchIcon className={classes.searchIcon} />
                <Typography type="title" className={classes.searchText}>
                  検索
                </Typography>
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
            <TextField
              fullWidth
              placeholder="キーワード（PHP,UX）サジェスト？"
              onChange={this.handleChangeKeyword}
            />
          </Grid>
          <Grid item className={classes.searchFormItem}>
            <TextField fullWidth placeholder="開催日 From（自動的に入れる）" />
          </Grid>
          <Grid item className={classes.searchFormItem}>
            <div className={classes.selectPlaceRoot}>
              <PrefMenu onSelectPref={(event,index) => { this.setState({ selectedIndex: index}) }}/>
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
            <Button className={classes.searchButton} onClick={this.handleSubmit}>検索する</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
SearchBox.propTypes = {
  rootClass: PropTypes.string,
  handleSubmit: PropTypes.func,
};
SearchBox.defaultProps = {
  rootClass: '',
  handleSubmit: false,
};

const mapDispatchToProps = dispatch => ({
  eventsAction: bindActionCreators(EventsActions, dispatch),
});

export default connect(null, mapDispatchToProps)(withStyles(styles)(SearchBox));
