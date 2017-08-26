import React from 'react';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

// TODO なぜかrightIconComponent,leftIconComponentが表示できない。
const styles = {
  root: {
    position: 'relative',
    display: 'inline-block',
  },
  left: {
    position: 'absolute',
    left: 0,
    top: 15,
    width: 20,
    height: 20,
  },
  right: {
    position: 'absolute',
    right: 0,
    top: 15,
    width: 20,
    height: 20,
  },
};

function IconTextField(props) {
  return (
    <div>
      <div className={props.classes.root}>
        <rightIconComponent className={props.classes.right} />
        <leftIconComponent className={props.classes.left} />
        <TextField {...props.textFieldProps} />
      </div>
    </div>
  );
}

IconTextField.propTypes = {
  classes: styles,
  textFieldProps: Object,
};

IconTextField.defaultProps = {
  classes: styles,
  rightIconComponent: null,
  leftIconComponent: null,
  textFieldProps: null,
};

export default withStyles(styles)(IconTextField);
