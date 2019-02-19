import React, { Component } from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import moment from 'moment';
import Paper from 'material-ui/Paper';
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from 'material-ui/Table';

import theme from '../utils/theme';
import InputHandler from '../components/InputHandler';
import rest from '../utils/rest';
import FullscreenSpinner from '../components/FullscreenSpinner';

const mapStateToProps = state => ({
  pushNotifications: state.pushNotifications,
});

const mapDispatchToProps = dispatch => ({
  sendNotification: notification => {
    dispatch(rest.actions.sendPushNotification(null,
      {
        body: JSON.stringify({ notification })
      }, () => dispatch(rest.actions.pushNotifications())
    ));
  },
  refresh: () => {
    dispatch(rest.actions.pushNotifications());
  },
});

class PushNotifications extends Component {
  componentDidMount() {
    this.props.refresh();
  }

  render() {
    const { sendNotification, intl, pushNotifications } =  this.props;
    return (
      <div style={{width: '100vw'}}>
        <Paper style={theme.paper}>
          <InputHandler
            btnName={intl.formatMessage({id: 'send'})}
            labelName={intl.formatMessage({id: 'pushNotifications_pushNotification'})}
            submitOnClear={false}
            multiline
            onSubmit={notification => {
              sendNotification(notification);
            }}
          />
        </Paper>
       <PushNotificationsTable {...pushNotifications} intl={intl} />
      </div>
    );
  }
}

const PushNotificationsTableHead = ({ intl }) => (
  <TableHead>
    <TableRow>
      <TableCell>
        {intl.formatMessage({id: 'pushNotifications_message'})}
      </TableCell>
      <TableCell>
        {intl.formatMessage({id: 'pushNotifications_time'})}
      </TableCell>
      <TableCell>
        {intl.formatMessage({id: 'pushNotifications_sender'})}
      </TableCell>
    </TableRow>
  </TableHead>
);

const PushNotificationsTableRow = ({ pushNotification }) => (
  <TableRow>
    <TableCell>
      {pushNotification.notification}
    </TableCell>
    <TableCell>
      {moment(pushNotification.time).format('DD-MM-YYYY hh:mm')}
    </TableCell>
    <TableCell>
      {pushNotification.username}
    </TableCell>
  </TableRow>
);

const PushNotificationsTableBody = ({ pushNotifications }) => (
  <TableBody>
    {
      pushNotifications.map(pushNotification =>
        <PushNotificationsTableRow key={pushNotification.id} pushNotification={pushNotification} />
      )
    }
  </TableBody>
);

const PushNotificationsTable = ({ data, intl, sync, loading }) => {
  if (loading || !sync) {
    return <FullscreenSpinner />;
  }

  return (
    <Table>
      <PushNotificationsTableHead intl={intl} />
      <PushNotificationsTableBody pushNotifications={data} />
    </Table>
  );
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PushNotifications));
