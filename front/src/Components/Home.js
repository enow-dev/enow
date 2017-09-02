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
import Menu, { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import InputLabel from 'material-ui/Input/InputLabel';
import FormControl from 'material-ui/Form/FormControl';
import List, { ListItem, ListItemText } from 'material-ui/List';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import * as ErrorActions from '../Actions/Error';
import * as AutosuggestActions from '../Actions/Autosuggest';
import * as EventsActions from '../Actions/Events';

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
  submitButton: {
    width: '100%',
    marginTop: 10,
  },
});

const prefs = [
  '選択してください','北海道', '青森県', '岩手県', '宮城県', '秋田県',
    '山形県', '福島県', '茨城県', '栃木県', '群馬県',
    '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県',
    '富山県', '石川県', '福井県', '山梨県', '長野県',
    '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県',
    '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
    '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県',
    '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県',
    '鹿児島県', '沖縄県'
];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      keyword: '',
      selectedPrefIndex: 0,
      isPrefOpen: false,
      anchorEl: undefined,
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

  handleKeywordChange = (event, { newValue }) => {
    this.setState({
      keyword: newValue,
    });
  };


  handleClickPrefListItem = event => {
    this.setState({ isPrefOpen: true, anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedPrefIndex: index, isPrefOpen: false });
  };

  handleRequestClose = () => {
    this.setState({ isPrefOpen: false });
  };

  renderPrefSelection(){
    return (
      <div>
        <FormControl style={{paddingTop: 20, width: '100%'}}>
          <InputLabel htmlFor="pref-item">都道府県</InputLabel>
          <List id="pref-item">
            <ListItem
              button
              onClick={this.handleClickPrefListItem}
              >
              <ListItemText
                primary={prefs[this.state.selectedPrefIndex]}
              />
            </ListItem>
          </List>
        </FormControl>
        <Menu
          anchorEl={this.state.anchorEl}
          open={this.state.isPrefOpen}
          onRequestClose={this.handleRequestClose}
        >
          {prefs.map((option, index) => (
              <MenuItem
                key={option}
                selected={index === this.state.selectedIndex}
                onClick={event => this.handleMenuItemClick(event, index)}
              >
                {option}
              </MenuItem>
            ))}
        </Menu>
      </div>
    );
  }

  handleSubmit = () => {
    const { eventsAction, history } = this.props;
    const { keyword, selectedPrefIndex } = this.state;
    eventsAction.getEventsIfNeeded(false,false, keyword, selectedPrefIndex);
    history.push('/events');
  }

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
                  value: this.state.keyword,
                  onChange: this.handleKeywordChange,
                }}
              />
            {this.renderPrefSelection()}
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
  aouth: state.aouth,
});
const mapDispatchToProps = dispatch => ({
  errorActions: bindActionCreators(ErrorActions, dispatch),
  autosuggestActions: bindActionCreators(AutosuggestActions, dispatch),
  eventsAction: bindActionCreators(EventsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
