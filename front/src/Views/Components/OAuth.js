import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as oauthActions from '../../Actions/OAuth';

class OAuth extends React.Component {
  componentWillMount() {
    const { oauthActions } = this.props;
    oauthActions.isCookieOAuth();
  }
  render() {
    const { children } = this.props;
    return (
      <div>
        { children }
      </div>
    );
  }
}

OAuth.propTypes = {
  oauthActions: PropTypes.shape({
    isCookieOAuth: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
};
OAuth.defaultProps = {
  children: null,
};

const mapDispatchToProps = dispatch => ({
  oauthActions: bindActionCreators(oauthActions, dispatch),
});

export default connect(null, mapDispatchToProps)(OAuth);
