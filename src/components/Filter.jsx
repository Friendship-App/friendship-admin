import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

import FilterListIcon from 'material-ui-icons/FilterList';

import theme from '../utils/theme';

class Filter extends React.Component {
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
      onFilter,
      textField,
      filterButton,
      fields,
    } = this.props;

    return (
      <div style={{display: 'flex'}}>
        <div style={theme.root}>
          <Grid container>
            <Grid item xs={12}>
              <Paper style={theme.paper}>

                <TextField
                  label={(textField && textField.label) || "Filter"}
                  margin="normal"
                  onChange={(event) => this.handleChange(event)}
                 />
                 <Button
                   color="primary"
                   key="submit"
                   onClick={() => onFilter(this.state.value)}
                   >{filterButton || "Go"}</Button>
                 <div style={{margin: '0 2px', width: 1, backgroundColor: 'rgba(0, 0, 0, 0.075)', display: 'inline-flex', verticalAlign: 'middle', height: 30}}></div>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}

export default Filter;
