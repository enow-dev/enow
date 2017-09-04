import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Autosuggest from 'react-autosuggest';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import PrefMenu from './PrefMenu';

import * as ErrorActions from '../Actions/Error';
import * as AutosuggestActions from '../Actions/Autosuggest';
import * as EventsActions from '../Actions/Events';
import * as SearchStashActions from '../Actions/SearchStash';

const styles = theme =>({
  root: {
    width: '100%',
    height: '100%',
    margin: 0,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
    marginBottom: 20,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
  submitButton: {
    width: '100%',
    marginTop: 10,
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      keyword: '',
      prefIndex: 0,
    };
    props.errorActions.removeError();
  }

  componentWillMount(){
    const { searchStash } = this.props;
    this.setState({...searchStash});
  }

  renderInput(inputProps) {
    const { classes, home, value, ref, ...other } = inputProps;

    return (
      <TextField
        fullWidth
        autoFocus
        label="キーワード"
        margin="normal"
        className={classes.textField}
        value={value}
        inputRef={ref}
        InputProps={{
          classes: {
            input: classes.input,
          },
          ...other,
        }}
      />
    );
  }
  renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.label, query);
    const parts = parse(suggestion.label, matches);

    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={index} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
              <strong key={index} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  }

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps}>
        {children}
      </Paper>
    );
  }

  getSuggestionValue(suggestion) {
    return suggestion.label;
  }

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const { suggests } = this.props.autosuggests;
    let count = 0;

    return inputLength === 0
      ? []
      : suggests.filter(suggestion => {
          const keep =
            count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    const { autosuggestActions } = this.props;
    autosuggestActions.getAutosuggestIfNeeded(value);
  };

  handleSuggestionsClearRequested = () => {
    const { autosuggestActions } = this.props;
    autosuggestActions.clearAutosuggest();
  };

  handleKeywordChange = (event, { newValue }) => {
    this.setState({
      keyword: newValue,
    });
  };

  handleSubmit = () => {
    const { eventsAction, history, searchStashActions } = this.props;
    const { keyword, prefIndex } = this.state;
    eventsAction.getEventsIfNeeded(false,false, keyword, prefIndex);
    searchStashActions.setSearchStash({...this.state});
    history.push('/events');
  }

  render() {
    const { classes,autosuggests } = this.props;
    return (
      <Grid
        container
        className={classes.root}
        align="center"
        direction="column"
        justify="center"
        spacing={40}
      >
        <Grid item>
          <Typography type="display3">IT系勉強会・イベント検索</Typography>
        </Grid>
        <Grid item>
          <Typography type="headline" color="accent">検索結果：あなたにとっての新着情報 ◯◯件です</Typography>
        </Grid>
        <Grid item style={{ width: '50%' }}>
          <Card>
            <CardContent>
              <Autosuggest
                theme={{
                  container: classes.container,
                  suggestionsContainerOpen: classes.suggestionsContainerOpen,
                  suggestionsList: classes.suggestionsList,
                  suggestion: classes.suggestion,
                }}
                renderInputComponent={this.renderInput}
                suggestions={autosuggests.suggests}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={{
                  autoFocus: true,
                  classes,
                  placeholder: 'Search a country (start with a)',
                  value: this.state.keyword,
                  onChange: this.handleKeywordChange,
                }}
              />
              <PrefMenu
                onSelectPref={(event,index) => { this.setState({prefIndex: index})}}
                defaultPrefIndex={this.state.prefIndex}
              />
              <Button
                raised
                color="primary"
                className={classes.submitButton}
                onClick={this.handleSubmit}
                >検索</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Typography type="headline">クリエイターのみなさん朗報です</Typography>
        </Grid>
        <Grid item>
          <Typography type="headline">昨日見た情報は検索結果に出ません</Typography>
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  errorActions: PropTypes.shape({
    removeError: PropTypes.func,
  }),
};

Home.defaultProps = {
  classes: Object,
  errorActions: PropTypes.shape({
    removeError: null,
  }),
};

const mapStateToProps = state => ({
  autosuggests: state.autosuggest,
  aouth: state.aouth,
  searchStash: state.searchStash,
});
const mapDispatchToProps = dispatch => ({
  errorActions: bindActionCreators(ErrorActions, dispatch),
  autosuggestActions: bindActionCreators(AutosuggestActions, dispatch),
  eventsAction: bindActionCreators(EventsActions, dispatch),
  searchStashActions: bindActionCreators(SearchStashActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
