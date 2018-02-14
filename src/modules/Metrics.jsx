import React from 'react';
import theme from "../utils/theme";
import {Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, CircularProgress } from "material-ui";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import rest from "../utils/rest";
import moment from "moment";
import {CardGridWrapper} from "../components/CardGridWrapper";

const mapStateToProps = state => ({
  registeredUsers: state.metricsRegisteredUsers,
  activeUsersCounts: state.metricsActiveUsers,
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
    dispatch(rest.actions.metricsActiveUsers());
  },
});

class Metrics extends React.Component {

  componentDidMount() {
    const {refresh} = this.props;

    refresh();
  }

  render() {
    // console.log(this.props.registeredUsers);   
    // console.log(this.props.registeredUsers.loading);   

    // check if the data is in loading or syncing before render the rows
    const renderMetricsRow = () => {
      // if (this.props.registeredUsers.loading) {
      //   return <CircularProgress />
      // }
      // else {
        if (this.props.registeredUsers.sync){          
          return this.props.registeredUsers.data.map(record => {
            // console.log('record');
            return <TableRow key={record.id}>
              <TableCell>{moment(record.timestamp).format('DD-MM-YYYY')}</TableCell>
              <TableCell>{record.registered_today}</TableCell>
              <TableCell>{record.users_count}</TableCell>
            </TableRow>           
          })  
        }      
      // } 
    }

    const renderActiveUsersRow = () => {
      if (this.props.activeUsersCounts.sync) {
        return this.props.activeUsersCounts.data.map(record => {
          return <TableRow key={record.id}>
            <TableCell>{moment(record.timestamp).format('DD-MM-YYYY')}</TableCell>
            <TableCell>{record.users_count}</TableCell>
          </TableRow>  
        })
      }
    }

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
              {renderMetricsRow()}
            </TableBody>
          </Table>
        </Paper>
        <Paper>
        <Typography type="headline" component="h3">
            Active Users
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{this.props.intl.formatMessage({id: 'metrics_day'})}</TableCell>
                <TableCell>{this.props.intl.formatMessage({id: 'metrics_users_total'})}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderActiveUsersRow()}
            </TableBody>
          </Table>
        </Paper>
      </CardGridWrapper>
    );
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Metrics));
