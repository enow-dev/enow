import React from 'react';
import PropTypes from 'prop-types';
import Tabs, { Tab } from 'material-ui/Tabs';

function EventsTab(props) {
  return (
    <Tabs value={props.selectTabIndex} onChange={props.handleTabChange}>
      <Tab label="開催昇順" />
      <Tab label="開催降順" />
      <Tab label="新着順" />
      <Tab label="お気に入り" />
      <Tab label="過去の履歴" />
    </Tabs>
  );
}

EventsTab.propTypes = {
  selectTabIndex: PropTypes.number,
  handleTabChange: PropTypes.func,
};

EventsTab.defaultProps = {
  selectTabIndex: 0,
  handleTabChange: null,
  appBarClass: '',
};

export default EventsTab;
