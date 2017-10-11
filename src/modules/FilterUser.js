import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

import rest from '../utils/rest';
import theme from '../utils/theme';

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = dispatch => ({
    filterUsers: (filter) => {
      dispatch(rest.actions.users.get({filter: filter}));
    },
})

class FilterUser extends React.Component {

  render() {
    return (
      <div>
        <div style={theme.root}>
          <Grid container>
            <Grid item xs={12}>
              <Paper style={theme.paper}>
                <TextField
                  label="Search user"
                  fullWidth
                  margin="normal"
                  onChange={(event) => this.props.filterUsers({username: event.target.value, email: event.target.value})}
                 
                 />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(FilterUser));
