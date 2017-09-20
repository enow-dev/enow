import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AouthActions from '../../Actions/Aouth';

class Aouth extends React.Component {
  componentWillMount() {
    const { aouthActions } = this.props;
    aouthActions.isCookieAouth();
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

Aouth.propTypes = {
  aouthActions: PropTypes.shape({
    isCookieAouth: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
};
Aouth.defaultProps = {
  children: null,
};

const mapDispatchToProps = dispatch => ({
  aouthActions: bindActionCreators(AouthActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Aouth);
