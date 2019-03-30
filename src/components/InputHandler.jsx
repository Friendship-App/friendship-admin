import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const initialState = {
  value: '',
  category: '',
};

class InputHandler extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    textField: PropTypes.shape({
      label: PropTypes.string,
    }),
    submitOnClear: PropTypes.bool,
    multiline: PropTypes.bool,
  }

  static defaultProps = {
    submitOnClear: true,
    multiline: false
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    const {
      onSubmit,
      textField,
      multiline,
      submitOnClear,
      intl,
    } = this.props;

    return (
      <div style={{display: 'flex', paddingLeft: 20}}>
        <TextField
          label={(textField && textField.label) || this.props.labelName}
          margin="normal"
          onChange={(event) => this.handleChange(event)}
          value={this.state.value}
          style={{width: 200}}
          multiline={multiline}
        />
        <Button
          color="primary"
          key="submit"
          onClick={() => {
            if (this.state.value) {
              onSubmit(this.props.addTags ? this.state : this.state.value);
            }
          }}
        >
          {this.props.btnName}
        </Button>
        <Button
          color="primary"
          key="clear"
          onClick={() => {
            if (this.state.value) {
              if (submitOnClear) {
                onSubmit(this.props.addTags ? initialState : initialState.value);
              }
              this.setState(initialState);
            }
          }}
        >
          {intl.formatMessage({id: 'clear'})}
        </Button>
      </div>
    )
  }
}

export default injectIntl(InputHandler);
