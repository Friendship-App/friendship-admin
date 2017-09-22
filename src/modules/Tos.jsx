import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from 'material-ui/Table';

import { LinearProgress } from 'material-ui/Progress';
import ListIcon from 'material-ui-icons/List';

import { DialogContentText } from 'material-ui/Dialog';
import DialogWithButtons from '../components/DialogWithButtons';

import rest from '../utils/rest';

// Here we 'connect' the component to the Redux store. This means that the component will receive
// parts of the Redux store as its props. Exactly which parts is chosen by mapStateToProps.

// We should map only necessary values as props, in order to avoid unnecessary re-renders. In this
// case we need the list of users, as returned by the REST API. The component will be able to access
// the users list via `this.props.users`. Additionally, we need details about the selected user,
// which will be available as `this.props.userDetails`.

// The second function (mapDispatchToProps) allows us to 'make changes' to the Redux store, by
// dispatching Redux actions. The functions we define here will be available to the component as
// props, so in our example the component will be able to call `this.props.refresh()` in order to
// refresh the users list, and `this.props.refreshUser(user)` to fetch more info about a specific
// user.

// More details: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options

// The injectIntl decorator makes this.props.intl.formatMessage available to the component, which
// is used for localization.

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export class Tos extends React.Component {
  // Component initial state.
  // Here we keep track of whether the user details dialog is open.
  state = {
    dialogOpen: false,
  };



  renderProgressBar() {
    /*
    const { usersLoading } = this.props;
    return usersLoading
      ? (
        <div style={{ marginBottom: '-5px' }}>
          <LinearProgress />
        </div>
      ) : null;*/
  }

  render() {
    return(
      <div>
        
      </div>
    );
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Tos));