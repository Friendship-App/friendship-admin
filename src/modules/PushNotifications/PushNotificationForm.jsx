import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import theme from '../../utils/theme';
import TextFieldWithEmojis from '../../components/TextFieldWithEmojis';

const defaultState = {
  title: '',
  message: '',
  submitClicked: false,
};

class PushNotificationForm extends Component {
  state = defaultState;

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    const width = 400;

    return (
      <div style={{ padding: theme.spacing.unit }}>
        <Typography
          style={{ marginBottom: theme.spacing.unit }}
          type="headline"
        >
          {formatMessage({ id: 'pushNotifications_new_push_notification' })}
        </Typography>
        <Paper style={theme.paper}>
          <div
            style={{ display: 'flex', padding: 20, flexDirection: 'column' }}
          >
            <TextFieldWithEmojis
              label={formatMessage({ id: 'pushNotifications_title' })}
              onChange={event => this.setState({ title: event.target.value })}
              value={this.state.title}
              style={{ width }}
            />
            <TextFieldWithEmojis
              label={formatMessage({ id: 'pushNotifications_message' })}
              onChange={event => this.setState({ message: event.target.value })}
              value={this.state.message}
              rows={6}
              style={{ width }}
              multiline
              error={!this.state.message && this.state.submitClicked}
              required
            />
            <Button
              color="primary"
              onClick={() => {
                this.setState({ submitClicked: true }, () => {
                  if (this.state.message) {
                    this.props.sendNotification(this.state);
                    this.setState({ ...defaultState });
                  }
                });
              }}
            >
              {formatMessage({ id: 'send' })}
            </Button>
          </div>
        </Paper>
      </div>
    );
  }
}

export default injectIntl(PushNotificationForm);
