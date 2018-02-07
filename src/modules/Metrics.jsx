import React from 'react';
import theme from "../utils/theme";
import {Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "material-ui";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import rest from "../utils/rest";
import moment from "moment";
import {CardGridWrapper} from "../components/CardGridWrapper";

const mapStateToProps = state => ({
  registeredUsers: state.metricsRegisteredUsers.data.data
});

const mapDispatchToProps = dispatch => ({

  /**
   * Refresh the all metrics
   *
   * @return {void}
   */
  refresh: () => {
    dispatch(rest.actions.metricsRegisteredUsers());
    //dispatch(rest.actions.metricsmsgperconversation());
  },
});

class Metrics extends React.Component {

  componentDidMount() {
    const {refresh} = this.props;

    refresh();
  }

  render() {
    console.log(this.props);
    return (
      <CardGridWrapper classes={theme.palette} width={100}>
        <Paper className={theme.paper}>
          <Typography type="headline" component="h3">
            Registered users
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{this.props.intl.formatMessage({id: 'metrics_day'})}</TableCell>
                <TableCell>{this.props.intl.formatMessage({id: 'metrics_users_registered_day'})}</TableCell>
                <TableCell>{this.props.intl.formatMessage({id: 'metrics_users_total'})}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.length > 0 ? (
                this.props.registeredUsers.map(record => {
                  return <TableRow key={record.id}>
                    <TableCell>{moment(record.timestamp).format('DD-MM-YYYY')}</TableCell>
                    <TableCell>{record.registered_today}</TableCell>
                    <TableCell>{record.users_count}</TableCell>
                  </TableRow>;
                })) : null}            
            </TableBody>
          </Table>
        </Paper>
      </CardGridWrapper>
    );
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Metrics));
