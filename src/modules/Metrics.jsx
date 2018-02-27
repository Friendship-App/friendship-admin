import React from 'react';
import theme from "../utils/theme";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, CircularProgress,Button} from "material-ui";
import FileDownload from 'material-ui-icons/FileDownload';
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import rest from "../utils/rest";
import moment from "moment";
import {CardGridWrapper} from "../components/CardGridWrapper";
import {CSVLink, CSVDownload} from 'react-csv';


const mapStateToProps = state => ({
  registeredUsers: state.metricsRegisteredUsers,
  activeUsersCounts: state.metricsActiveUsers,
  activeConversations:state.metricsActiveConversations,
  conversationsLength:state.metricsConversationsLength
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
    dispatch(rest.actions.metricsActiveConversations());
    dispatch(rest.actions.metricsConversationsLength());
  }
  
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
          return this.props.registeredUsers.data.map((record,index) => {
            // console.log(record);
            return <TableRow key={record.id}>
              <TableCell>{moment(record.timestamp).format('DD-MM-YYYY')}</TableCell>
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
    
    const renderActiveConversations=()=>{
      if (this.props.activeConversations.sync) {
        return this.props.activeConversations.data.map((record)=>{
          return <TableRow key={record.id}>
            <TableCell>{moment(record.timestamp).format('DD-MM-YYYY')}</TableCell>
            <TableCell>{record.conversations_count}</TableCell>
          </TableRow>
        })
      }
    }

    const renderConversationLength=()=>{
      if (this.props.conversationsLength.sync) {
        return this.props.conversationsLength.data.map((record)=>{
          return <TableRow key={record.id}>
            <TableCell>{moment(record.timestamp).format('DD-MM-YYYY')}</TableCell>
            <TableCell>{record.conversations_length}</TableCell>
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
                <TableCell>{this.props.intl.formatMessage({ id: 'metrics_day' })}</TableCell>
                <TableCell>{this.props.intl.formatMessage({ id: 'metrics_users_total' })}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderMetricsRow()}
            </TableBody>
          </Table>
          <br/>
          <div style={{textAlign:'center'}}>
          <Button color="secondary">
            <CSVLink data={this.props.registeredUsers.data} filename={'registered-users.csv'}>
              Download Registered Users Metrics 
            </CSVLink>
            <FileDownload/>
            </Button>
          </div>
          <br/>
        </Paper>
        <Paper>
          <Typography type="headline" component="h3">
            Active Users
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{this.props.intl.formatMessage({ id: 'metrics_day' })}</TableCell>
                <TableCell>{this.props.intl.formatMessage({ id: 'metrics_users_total' })}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderActiveUsersRow()}
            </TableBody>
          </Table>
          <br/>
          <div style={{textAlign:'center'}}>
          <Button> 
            <CSVLink data={this.props.activeUsersCounts.data} filename={'lastActive-users.csv'}>
              Download Active Users Metrics 
            </CSVLink>
            <FileDownload/>
          </Button>
        </div>
        <br/>
        </Paper>
        <Paper>
          <Typography type="headline" component="h3">
            Active Conversations
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{this.props.intl.formatMessage({ id: 'metrics_day' })}</TableCell>
                <TableCell>{this.props.intl.formatMessage({ id: 'metrics_conversation_total' })}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderActiveConversations()}
            </TableBody>
          </Table>
          <br/>
          <div style={{textAlign:'center'}}>
          <Button> 
            <CSVLink data={this.props.activeConversations.data} filename={'active-conversations.csv'}>
              Download Active Conversations Metrics 
            </CSVLink>
            <FileDownload/>
          </Button>
        </div>
        <br/>
        </Paper>
        <Paper>
          <Typography type="headline" component="h3">
            Conversation Length 
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{this.props.intl.formatMessage({ id: 'metrics_day' })}</TableCell>
                <TableCell>{this.props.intl.formatMessage({ id: 'metrics_conversation_length' })}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderConversationLength()}
            </TableBody>
          </Table>
          <br/>
          <div style={{textAlign:'center'}}>
          <Button> 
            <CSVLink data={this.props.conversationsLength.data} filename={'conversations-length.csv'}>
              Download Conversation Length Metrics 
            </CSVLink>
            <FileDownload/>
          </Button>
        </div>
        <br/>
        </Paper>
      </CardGridWrapper>
    );
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Metrics));
