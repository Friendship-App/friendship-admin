import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

class InputHandler extends React.Component {

  constructor(props){
    super(props)
  }

  static PropTypes = {
    onChange: PropTypes.isRequired,
    textField: PropTypes.shape({
      label: PropTypes.string,
    }),
    filterButton: PropTypes.string
  }

  state = {
    value: '',
  }

  handleChange = (event) => {
    const {
      onChange
    } = this.props;
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    const {
      onSubmit,
      textField,
      filterButton,
      fields,
    } = this.props;

    return (
        <div style={{paddingLeft: 20}}>
          <TextField
            label={(textField && textField.label) || this.props.labelName}
            margin="normal"
            onChange={(event) => this.handleChange(event)}
            value={this.state.value}
          />
          <Button
            color="primary"
            key="submit"
            onClick={async () => {
              await onSubmit(this.state.value);
              this.setState({value: ""});
            }}
          >
            {this.props.btnName}
          </Button>
        </div>
    )
  }
}

export default InputHandler;
