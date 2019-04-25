import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { FormControlLabel, FormLabel } from 'material-ui/Form';
import Radio from 'material-ui/Radio';
import theme from '../../utils/theme';

const initialState = {
  name: '',
  type: 'base',
  showInputError: false,
};

class AddTagForm extends React.Component {
  state = initialState;

  static propTypes = {
    addTag: PropTypes.func.isRequired,
  };

  handleChange = (event, key) => {
    this.setState({
      [key]: event.target.value,
    });
  };

  submit = () => {
    const { addTag } = this.props;
    const { name, type } = this.state;
    if (name) {
      addTag({
        name,
        type,
      });
      this.setState({ showInputError: false, name: '' });
    } else {
      this.setState({ showInputError: true });
    }
  };

  renderRadioInput = type => {
    const {
      intl: { formatMessage },
    } = this.props;

    return (
      <FormControlLabel
        value={type}
        onChange={event => this.handleChange(event, 'type')}
        checked={this.state.type === type}
        control={<Radio />}
        label={formatMessage({ id: `tag_type_${type}` })}
      />
    );
  };

  get typeRadio() {
    const {
      intl: { formatMessage },
    } = this.props;
    return (
      <div style={{ textAlign: 'start', marginTop: 10 }}>
        <FormLabel component="legend">
          {formatMessage({ id: 'tag_type' })}
        </FormLabel>
        {this.renderRadioInput('base')}
        {this.renderRadioInput('alternating')}
      </div>
    );
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    const { showInputError, name } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          paddingLeft: 20,
          paddingRight: 20,
          marginTop: 10,
          flexDirection: 'column',
        }}
      >
        <Typography
          style={{ marginBottom: theme.spacing.unit }}
          type="headline"
        >
          {formatMessage({ id: 'tag_add' })}
        </Typography>
        <TextField
          label={formatMessage({ id: 'tagName' })}
          onChange={event => this.handleChange(event, 'name')}
          value={name}
          style={{ width: 200 }}
          error={!name && showInputError}
        />
        {this.typeRadio}
        <Button color="primary" key="submit" onClick={this.submit}>
          {formatMessage({ id: 'add' })}
        </Button>
      </div>
    );
  }
}

export default injectIntl(AddTagForm);
