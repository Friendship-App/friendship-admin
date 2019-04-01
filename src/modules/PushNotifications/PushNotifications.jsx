import React, { Component } from 'react';
import { connect } from 'react-redux';

import rest from '../../utils/rest';
import PushNotificationForm from './PushNotificationForm';
import PushNotificationsTable from './PushNotificationsTable';

const mapStateToProps = state => ({
  pushNotifications: state.pushNotifications,
});

const mapDispatchToProps = dispatch => ({
  refresh: () => {
    dispatch(rest.actions.pushNotifications());
  },
  sendNotification: notification => {
    dispatch(
      rest.actions.sendPushNotification(
        null,
        {
          body: JSON.stringify({ ...notification }),
        },
        () => dispatch(rest.actions.pushNotifications()),
      ),
    );
  },
});

class PushNotifications extends Component {
  componentDidMount() {
    this.props.refresh();
  }

  render() {
    const { pushNotifications, sendNotification } = this.props;
    return (
      <div style={{ width: '100vw' }}>
        <PushNotificationForm sendNotification={sendNotification} />
        <PushNotificationsTable {...pushNotifications} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PushNotifications);
