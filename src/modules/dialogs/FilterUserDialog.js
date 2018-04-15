import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

import DialogWithButtons from '../../components/DialogWithButtons';

import rest from '../../utils/rest';
import theme from '../../utils/theme';

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = dispatch => ({
  filterUsers: filter => {
    dispatch(rest.actions.users.get({ filter: filter }));
  },
});

class FilterUserDialog extends React.Component {
  renderDesc = () => {};

  render() {
    return (
      <DialogWithButtons
        textField={{ label: 'Search', fullWidth: true }}
        title="Search user"
        description={this.renderDesc()}
        submitAction="Search"
        cancelAction="Cancel"
        isOpen={this.props.isOpen}
        submit={data => {}}
      />
    );
  }
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(FilterUserDialog),
);
