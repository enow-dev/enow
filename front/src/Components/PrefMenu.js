import React from 'react';
import PropTypes from 'prop-types';

import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import InputLabel from 'material-ui/Input/InputLabel';
import FormControl from 'material-ui/Form/FormControl';

const prefs = [
  '選択してください',
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];


class PrefMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      selectedPrefIndex: 0,
      isPrefOpen: false,
      anchorEl: undefined,
    };
  }

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
    const { onSelectPref } = this.props;
    return (
      <div>
        <FormControl style={{paddingTop: 20, width: '100%'}}>
          <InputLabel htmlFor="pref-item">{this.state.selectedPrefIndex > 0 ? '' : '都道府県'}</InputLabel>
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
                onClick={event => {
                  this.handleMenuItemClick(event, index);
                  if(onSelectPref){
                    onSelectPref(event, index);
                  }
                }}
              >
                {option}
              </MenuItem>
            ))}
        </Menu>
      </div>
    );
  }

  render() {
    return this.renderPrefSelection();
  }
}

PrefMenu.propTypes = {
  onSelectPref: PropTypes.func,
};
PrefMenu.defaultProps = {
  onSelectPref: false,
}
export default PrefMenu;
