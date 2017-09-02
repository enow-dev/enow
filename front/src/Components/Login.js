import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Card, { CardContent, CardHeader } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import * as AouthActions from '../Actions/Aouth';

function getQueryString() {
  const result = {};
  if (window.location.search.length > 1) {
    const query = window.location.search.substring(1);
    const parameters = query.split('&');
    for (let i = 0; i < parameters.length; i++) {
      const element = parameters[i].split('=');
      const paramName = decodeURIComponent(element[0]);
      const paramValue = decodeURIComponent(element[1]);
      result[paramName] = paramValue;
    }
  }
  return result;
}

const CLIENT_ID = "87a42765a18adc939d0a";

class Login extends React.Component {

  handleOnClick = () => {
    this.startAouth();
  }

  startAouth = () => {
    console.log('start aouth');
    window.location.href = "https://github.com/login/oauth/authorize?client_id="+CLIENT_ID+"&scope=user:email&redirect_uri=http://localhost:3000/login";
  }

  checkAouth = () => {
    const attr = getQueryString();
    if ("code" in attr) {
      const { aouthActions } = this.props;
      aouthActions.loginIfNeeded(attr["code"]);
      return;
    }
    console.log('not in code');
  }
  renderAouthInfo(){
    const {aouth} = this.props;
    console.log(aouth);
    return
    <div>
      <ul>
        <li>{aouth.info.expire}</li>
        <li>{aouth.info.name}</li>
        <li>{aouth.info.token}</li>
      </ul>
    </div>;
  }
  shouldComponentUpdate(nextProps, nextState){
    console.log('shouldComponentUpdate',nextProps,nextProps);
    const { aouth, history } = nextProps;
    if (aouth.isAouth) {
      history.replace('/');
      return false;
    }
    return true;
  }
  render() {
    const {aouth} = this.props;
    this.checkAouth();
    return (
      <Grid container align="center" direction="column" justify="center">
        <Grid item>
          <Card>
            <CardHeader>ログイン</CardHeader>
            <CardContent>
              <Grid container align="center" direction="column" justify="center" spacing={40}>
                <Grid item>
                  <Button onClick={this.handleOnClick}>Github</Button>
                </Grid>
                { aouth.info ? this.renderAouthInfo() : null }
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}
const mapStateToProps = state => ({
  aouth: state.aouth,
});
const mapDispatchToProps = dispatch => ({
  aouthActions: bindActionCreators(AouthActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
