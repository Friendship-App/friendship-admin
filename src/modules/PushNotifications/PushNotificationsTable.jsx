import React from 'react';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from 'material-ui/Table';
import Typography from 'material-ui/Typography';

import FullscreenSpinner from '../../components/FullscreenSpinner';
import theme from '../../utils/theme';

const PushNotificationsTableHead = ({ intl }) => (
  <TableHead>
    <TableRow>
      <TableCell>
        {intl.formatMessage({ id: 'pushNotifications_title' })}
      </TableCell>
      <TableCell>
        {intl.formatMessage({ id: 'pushNotifications_message' })}
      </TableCell>
      <TableCell>
        {intl.formatMessage({ id: 'pushNotifications_time' })}
      </TableCell>
      <TableCell>
        {intl.formatMessage({ id: 'pushNotifications_sender' })}
      </TableCell>
    </TableRow>
  </TableHead>
);

const PushNotificationsTableRow = ({ pushNotification }) => (
  <TableRow>
    <TableCell>{pushNotification.title}</TableCell>
    <TableCell>{pushNotification.message}</TableCell>
    <TableCell>
      {moment(pushNotification.time).format('DD-MM-YYYY hh:mm')}
    </TableCell>
    <TableCell>{pushNotification.username}</TableCell>
  </TableRow>
);

const PushNotificationsTableBody = ({ pushNotifications }) => (
  <TableBody>
    {pushNotifications.map(pushNotification => (
      <PushNotificationsTableRow
        key={pushNotification.id}
        pushNotification={pushNotification}
      />
    ))}
  </TableBody>
);

const PushNotificationsTable = ({ data, intl, sync, loading }) => {
  let content;
  if (loading || !sync) {
    content = <FullscreenSpinner />;
  } else {
    content = (
      <Table>
        <PushNotificationsTableHead intl={intl} />
        <PushNotificationsTableBody pushNotifications={data} />
      </Table>
    );
  }

  return (
    <div style={{ padding: theme.spacing.unit }}>
      <Typography type="headline" style={{ marginBottom: theme.spacing.unit }}>
        {intl.formatMessage({ id: 'PushNotifications' })}
      </Typography>
      {content}
    </div>
  );
};

export default injectIntl(PushNotificationsTable);
