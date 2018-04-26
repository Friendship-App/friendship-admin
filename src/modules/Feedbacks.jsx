import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from 'material-ui/Table';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import { LinearProgress } from 'material-ui/Progress';
import ListIcon from 'material-ui-icons/List';
import DeleteIcon from 'material-ui-icons/Delete';
import WarningIcon from 'material-ui-icons/Warning';
import NumberFormat from 'react-number-format';
import { DialogContentText, Dialog } from 'material-ui/Dialog';

import DialogWithButtons from '../components/DialogWithButtons';
import rest from '../utils/rest';
import Paper from 'material-ui/Paper';

const mapStateToProps = state => ({
  feedbacks: state.feedbacks,
  feedbacksLoading: state.feedbacks.loading,
  totalFeedbacks: state.totalFeedbacks,
  feedbackDetails: state.feedbackDetails,
  userToken: state.auth.data.token
});

const mapDispatchToProps = dispatch => ({
  getFeedbacksByPage: startIndex => {
    dispatch(rest.actions.feedbacks({ startIndex }));
  },

  getTotalFeedbacks: () => {
    dispatch(rest.actions.totalFeedbacks());
  },

  getFeedbackDetails: feedbackId => {
    dispatch(rest.actions.feedbackDetails({ feedbackId }));
  },

  deleteFeedback: feedback => {
    dispatch(
      rest.actions.feedbackDetails.delete(
        { feedbackId: feedback.id },
        null,
        () => {
          dispatch(rest.actions.feedbacks({ startIndex: 1 }));
        }
      )
    );
  }
});

export class Feedbacks extends React.Component {
  state = {
    currentPage: 1,
    openDeleteModal: false,
    selectedFeedback: '',
    feedbackDetailModal: false
  };

  // Refresh report list when component is first mounted
  componentWillMount() {
    const { getFeedbacksByPage, getTotalFeedbacks } = this.props;
    getTotalFeedbacks();
    getFeedbacksByPage(1);
  }

  renderProgressBar() {
    const { feedbacksLoading } = this.props;
    return feedbacksLoading ? (
      <div style={{ marginBottom: '-5px' }}>
        <LinearProgress />
      </div>
    ) : null;
  }

  deleteModal() {
    return (
      <DialogContentText>
        <strong>
          {this.props.intl.formatMessage({
            id: 'Are you sure you want to delete this feedback?'
          })}
        </strong>
      </DialogContentText>
    );
  }

  showFeedbackDetail(id) {
    fetch(`http://localhost:3888/feedbacks/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.userToken}`
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          selectedFeedback: res[0],
          feedbackDetailModal: true
        });
      });
  }

  onPageChange = page => {
    let nextStartIndex = page === 1 ? 1 : parseInt(page + '0');
    this.setState({
      currentPage: page
    });
    this.props.getTotalFeedbacks();
    this.props.getFeedbacksByPage(
      nextStartIndex
    ); /** in the back-end this is called offset, but here startIndex is better naming.https://www.postgresql.org/docs/8.0/static/queries-limit.html*/
  };

  feedbackDetails = () => {
    const {
      suggestion,
      username,
      findFriendEasy,
      findFriendHard,
      suggestImprovement,
      OtherReason,
      joinAppReasons,
      goalRate
    } = this.state.selectedFeedback;
    const { intl: { formatMessage } } = this.props;
    const fallBack = 'None';
    return (
      <div>
        <DialogContentText>
          <b>
            {formatMessage({
              id: 'username'
            })}
          </b>
          {`: ${username}`}
        </DialogContentText>
        <DialogContentText>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <b>
              {formatMessage({
                id: 'Reasons for joining the app: '
              })}
            </b>
            {joinAppReasons.length > 1 ? (
              <ul>
                {joinAppReasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            ) : (
              <span>None</span>
            )}
          </div>
        </DialogContentText>
        <DialogContentText>
          <b>
            {formatMessage({
              id: 'Other reasons for joining the app: '
            })}
          </b>
          {OtherReason ? OtherReason : fallBack}
        </DialogContentText>
        <DialogContentText>
          <b>
            {formatMessage({
              id: 'Suggestion for interest or activity or an idea: '
            })}
          </b>
          {suggestion ? suggestion : fallBack}
        </DialogContentText>
        <DialogContentText>
          <b>
            {formatMessage({
              id: 'How has the app made finding one good friend easy: '
            })}
          </b>
          {findFriendEasy ? findFriendEasy : fallBack}
        </DialogContentText>
        <DialogContentText>
          <b>
            {formatMessage({
              id: 'How has the app made finding one good friend hard: '
            })}
          </b>
          {findFriendHard ? findFriendHard : fallBack}
        </DialogContentText>
        <DialogContentText>
          <b>{formatMessage({ id: 'How we could improve: ' })}</b>
          {suggestImprovement ? suggestImprovement : fallBack}
        </DialogContentText>
      </div>
    );
  };

  renderFeedbacks = feedback => (
    <TableRow key={feedback.id}>
      <TableCell style={styles}>{feedback.id}</TableCell>
      <TableCell style={styles}>{feedback.given_by}</TableCell>
      <TableCell style={styles}>{feedback.rating}</TableCell>
      <TableCell style={styles}>{feedback.goalRate}</TableCell>
      <TableCell style={styles}>{feedback.createdAt}</TableCell>
      <TableCell>
        <Button
          onClick={() =>
            this.setState({
              openDeleteModal: true,
              selectedFeedback: feedback
            })}
          color="primary"
        >
          <DeleteIcon style={{ paddingRight: 10 }} />
          {this.props.intl.formatMessage({ id: 'Delete Feedback' })}
        </Button>
        <Button
          color="primary"
          onClick={() => this.showFeedbackDetail(feedback.id)}
        >
          <ListIcon style={{ paddingRight: 10 }} />
          {this.props.intl.formatMessage({ id: 'showFeedbackDetails' })}
        </Button>
      </TableCell>
    </TableRow>
  );

  renderDialogs = () => (
    <div>
      <DialogWithButtons
        title={this.props.intl.formatMessage({ id: 'Feedback details' })}
        description={this.state.feedbackDetailModal && this.feedbackDetails()}
        submitAction={this.props.intl.formatMessage({ id: 'close' })}
        isOpen={this.state.feedbackDetailModal}
        submit={() => this.setState({ feedbackDetailModal: false })}
        close={() => this.setState({ feedbackDetailModal: false })}
      />
      <DialogWithButtons
        title={this.props.intl.formatMessage({ id: 'Delete Feedback' })}
        description={this.deleteModal()}
        submitAction={this.props.intl.formatMessage({ id: 'Yes' })}
        cancelAction={this.props.intl.formatMessage({ id: 'Cancel' })}
        isOpen={this.state.openDeleteModal}
        submit={() => {
          this.props.deleteFeedback(this.state.selectedFeedback);
          this.setState({ openDeleteModal: false, feedbackDetailModal: false });
        }}
        close={() =>
          this.setState({ openDeleteModal: false, feedbackDetailModal: false })}
      />
    </div>
  );

  render() {
    return (
      <Paper
        style={{
          width: 1300,
          overflowX: 'auto'
        }}
      >
        {this.renderDialogs()}
        {this.renderProgressBar()}
        <Table style={{ width: '70%' }}>
          <TableHead>
            <TableRow>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'feedbackId' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'user_id' })}
              </TableCell>
              <TableCell style={{ whiteSpace: 'normal' }}>
                {this.props.intl.formatMessage({ id: 'overall rating' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({
                  id: 'rating matches to original goal'
                })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'created At' })}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.feedbacks.data.map(feedback =>
              this.renderFeedbacks(feedback)
            )}
          </TableBody>
        </Table>
        <Pagination
          className="ant-pagination"
          style={{ display: 'flex', justifyContent: 'center' }}
          onChange={this.onPageChange}
          defaultCurrent={this.state.currentPage}
          total={this.props.totalFeedbacks.data[0].count}
        />
      </Paper>
    );
  }
}

const styles = {
  //fix overflow
  whiteSpace: 'normal',
  wordWrap: 'break-word'
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Feedbacks)
);
