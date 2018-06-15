import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import {MenuItem, Select} from "material-ui";

const initialState = {
  value: '',
  category: '',
};

class InputHandler extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  static PropTypes = {
    onChange: PropTypes.isRequired,
    textField: PropTypes.shape({
      label: PropTypes.string,
    }),
    filterButton: PropTypes.string
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
      <div style={{display: 'flex', paddingLeft: 20}}>
        <TextField
          label={(textField && textField.label) || this.props.labelName}
          margin="normal"
          onChange={(event) => this.handleChange(event)}
          value={this.state.value}
          style={{width: 200}}
        />
        {this.props.addTags ? (
          <TextField
            select
            label="Select category"
            margin="normal"
            onChange={(evt) => this.setState({category: evt.target.value})}
            value={this.state.category}
            style={{width: 150, marginLeft: 20}}
          >
            <MenuItem value={1}>Activity</MenuItem>
            <MenuItem value={2}>Interest</MenuItem>
          </TextField>
        ) : null}
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
              onSubmit(this.props.addTags ? initialState : initialState.value);
              this.setState(initialState);
            }
          }}
        >
          Clear
        </Button>
      </div>
    )
  }
}

export default InputHandler;
