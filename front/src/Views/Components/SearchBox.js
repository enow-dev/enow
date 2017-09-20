import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment/locale/ja';

import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import SearchIcon from 'material-ui-icons/Search';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import { grey } from 'material-ui/colors';

import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import PrefMenu from './PrefMenu';

import * as EventsActions from '../../Actions/Events';
import * as SearchStashActions from '../../Actions/SearchStash';

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
    width: '90%',
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
      prefIndex: 0,
      isRed: false,
      startDate: null,
      endDate: null,
      focusedDatePicker: null,
    };
  }

  componentWillMount() {
    const { searchStash } = this.props;
    this.setState({
      ...searchStash,
      startDate: moment(searchStash.startDate),
      endDate: moment(searchStash.endDate),
    });
  }

  handleChangeAleady = (event, checked) => {
    this.setState({ isRed: checked });
  };

  handleChangeKeyword = (event) => {
    this.setState({keyword: event.target.value});
  }

  handleSubmit = () => {
    const { eventsActions, handleSubmit, searchStashActions } = this.props;
    const { isRed, keyword, prefIndex, startDate, endDate } = this.state;
    if(handleSubmit){
      handleSubmit();
    }
    searchStashActions.setSearchStash({...this.state});
    eventsActions.getEventsIfNeeded(false, isRed, keyword, prefIndex, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
  }

  render() {
    const { classes } = this.props;
    moment.locale('ja');
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
              value={this.state.keyword}
              onChange={this.handleChangeKeyword}
            />
          </Grid>
          <Grid item className={classes.searchFormItem}>
            <DateRangePicker
              startDatePlaceholderText="開催日 From"
              endDatePlaceholderText="開催日 End"
              monthFormat="YYYY[年]MM[月]"
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
              focusedInput={this.state.focusedDatePicker}
              onFocusChange={focusedDatePicker => this.setState({ focusedDatePicker })}
              weekDayFormat="dd"
            />
          </Grid>
          <Grid item className={classes.searchFormItem}>
            <div className={classes.selectPlaceRoot}>
              <PrefMenu
                onSelectPref={(event,index) => { this.setState({ prefIndex: index}) }}
                defaultPrefIndex={this.state.prefIndex}
              />
            </div>
          </Grid>
          <Grid item className={classes.searchFormItem}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.isRed}
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
  handleSubmit: null,
};

const mapStateToProps = state => ({
  searchStash: state.searchStash,
})
const mapDispatchToProps = dispatch => ({
  eventsActions: bindActionCreators(EventsActions, dispatch),
  searchStashActions: bindActionCreators(SearchStashActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SearchBox));
