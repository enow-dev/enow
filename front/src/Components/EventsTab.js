import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

function EventsTab(props) {
  return (
    <AppBar position="static">
      <Tabs value={props.selectTabIndex} onChange={props.handleTabChange}>
        <Tab label="開催昇順" />
        <Tab label="開催降順" />
        <Tab label="新着順" />
      </Tabs>
    </AppBar>
  );
}

EventsTab.propTypes = {
  selectTabIndex: PropTypes.number,
  handleTabChange: PropTypes.func,
};

EventsTab.defaultProps = {
  selectTabIndex: 0,
  handleTabChange: null,
};

export default EventsTab;
