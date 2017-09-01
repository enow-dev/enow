import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Autosuggest from 'react-autosuggest';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import * as ErrorActions from '../Actions/Error';
import * as AutosuggestActions from '../Actions/Autosuggest';

const styles = theme =>({
  root: {
    width: '100%',
    height: '100%',
    margin: 0,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 200,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
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
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      value: '',
    };
    props.errorActions.removeError();
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
    console.log('handleSuggestionsClearRequested');
    const { autosuggestActions } = this.props;
    autosuggestActions.clearAutosuggest();
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  render() {
    const { classes,autosuggests } = this.props;
    console.log(this.props);
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
                  value: this.state.value,
                  onChange: this.handleChange,
                }}
              />
              <TextField fullWidth label="都道府県" margin="normal" />
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
  classes: styles,
  errorActions: PropTypes.shape({
    removeError: PropTypes.func,
  }),
};

Home.defaultProps = {
  classes: styles,
  errorActions: PropTypes.shape({
    removeError: null,
  }),
};

const mapStateToProps = state => ({
  autosuggests: state.autosuggest,
});
const mapDispatchToProps = dispatch => ({
  errorActions: bindActionCreators(ErrorActions, dispatch),
  autosuggestActions: bindActionCreators(AutosuggestActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
