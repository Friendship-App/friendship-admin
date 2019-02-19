import React from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import Paper from 'material-ui/Paper';

import theme from '../utils/theme';
import InputHandler from "../components/InputHandler";
import rest from '../utils/rest';

const mapDispatchToProps = dispatch => ({
  sendNotification: notification => {
    dispatch(rest.actions.sendPushNotification(null, {
      body: JSON.stringify({ notification })
    }));
  }
});

const PushNotifications = ({ sendNotification, intl }) => (
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
  </div>
);

export default injectIntl(connect(null, mapDispatchToProps)(PushNotifications));