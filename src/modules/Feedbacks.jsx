import React from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import Button from 'material-ui/Button';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from 'material-ui/Table';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import {LinearProgress} from 'material-ui/Progress';
import ListIcon from 'material-ui-icons/List';
import DeleteIcon from 'material-ui-icons/Delete';
import {Dialog, DialogContentText} from 'material-ui/Dialog';
import moment from 'moment';

import DialogWithButtons from '../components/DialogWithButtons';
import rest from '../utils/rest';
import Paper from 'material-ui/Paper';
import FullscreenSpinner from '../components/FullscreenSpinner';

const mapStateToProps = state => ({
  feedbacks: state.feedbacks,
  feedbacksLoading: state.feedbacks.loading,
  totalFeedbacks: state.totalFeedbacks
});

const mapDispatchToProps = dispatch => ({
  getFeedbacksByPage: startIndex => {
    dispatch(rest.actions.feedbacks({startIndex}));
  },

  getTotalFeedbacks: () => {
    dispatch(rest.actions.totalFeedbacks());
  },

  deleteFeedback: (feedback, currentPage) => {
    dispatch(
        rest.actions.feedbackDetails.delete(
            {feedbackId: feedback.id},
            null,
            () => {
              dispatch(
                  rest.actions.feedbacks({
                    startIndex: currentPage === 1 ? 1 : parseInt(currentPage + '0')
                  }) // stay on the same page after delete
              );
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
    const {getFeedbacksByPage, getTotalFeedbacks} = this.props;
    getTotalFeedbacks(); //for pagination, get total number of feedbacks
    getFeedbacksByPage(1);
  }

  renderProgressBar() {
    const {feedbacksLoading} = this.props;
    return feedbacksLoading ? (
        <div style={{marginBottom: '-5px'}}>
          <LinearProgress/>
        </div>
    ) : null;
  }

  deleteModal() {
    return (
        <DialogContentText>
          <strong>
            {this.props.intl.formatMessage({
              id: 'feedback_deleteConfirm'
            })}
          </strong>
        </DialogContentText>
    );
  }

  showFeedbackDetail(feedback) {
    this.setState({
      selectedFeedback: feedback,
      feedbackDetailModal: true
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
    );
    /** in the back-end this is called offset, but here startIndex is better naming.https://www.postgresql.org/docs/8.0/static/queries-limit.html*/
  };

  feedbackDetails = () => {
    const {
      suggestion,
      findFriendEasy,
      findFriendHard,
      suggestImprovement,
      OtherReason,
      joinAppReasons,
      goalRate
    } = this.state.selectedFeedback;
    const {intl: {formatMessage}} = this.props;
    return (
        <div>
          <DialogContentText style={{margin: '10px 0 10px 0'}}>
            <b>
              {formatMessage({
                id: 'feedback_goalRate'
              })}
            </b>
            {` ${goalRate}`}
          </DialogContentText>
          {joinAppReasons.length > 1 && (
              <DialogContentText style={{margin: '10px 0 10px 0'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <b>
                    {formatMessage({
                      id: 'feedback_reasons'
                    })}
                  </b>
                  <ul>
                    {joinAppReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </DialogContentText>
          )}
          {OtherReason && (
              <DialogContentText style={{margin: '10px 0 10px 0'}}>
                <b>
                  {formatMessage({
                    id: 'feedback_otherReason'
                  })}
                </b>
                {OtherReason}
              </DialogContentText>
          )}
          {suggestion && (
              <DialogContentText style={{margin: '10px 0 10px 0'}}>
                <b>
                  {formatMessage({
                    id: 'feedback_suggestion'
                  })}
                </b>
                {suggestion}
              </DialogContentText>
          )}
          {findFriendEasy && (
              <DialogContentText style={{margin: '10px 0 10px 0'}}>
                <b>
                  {formatMessage({
                    id: 'feedback_findFriendEasy'
                  })}
                </b>
                {findFriendEasy}
              </DialogContentText>
          )}
          {findFriendHard && (
              <DialogContentText style={{margin: '10px 0 10px 0'}}>
                <b>
                  {formatMessage({
                    id: 'feedback_findFriendHard'
                  })}
                </b>
                {findFriendHard}
              </DialogContentText>
          )}
          {suggestImprovement && (
              <DialogContentText style={{margin: '10px 0 10px 0'}}>
                <b>{formatMessage({id: 'feedback_improvement'})}</b>
                {suggestImprovement}
              </DialogContentText>
          )}
        </div>
    );
  };

  renderFeedbacks = feedback => (
      <TableRow key={feedback.id}>
        <TableCell style={styles}>{feedback.id}</TableCell>
        <TableCell style={styles}>{feedback.given_by}</TableCell>
        <TableCell style={styles}>{feedback.username}</TableCell>
        <TableCell style={styles}>{feedback.rating}</TableCell>
        <TableCell>{moment(feedback.createdAt).format('DD-MM-YYYY')}</TableCell>
        <TableCell numeric>
          <Button
              onClick={() =>
                  this.setState({
                    openDeleteModal: true,
                    selectedFeedback: feedback
                  })}
              color="primary"
          >
            <DeleteIcon style={{paddingRight: 10}}/>
            {this.props.intl.formatMessage({id: 'feedback_delete'})}
          </Button>
          <Button
              color="primary"
              onClick={() => this.showFeedbackDetail(feedback)}
          >
            <ListIcon style={{paddingRight: 10}}/>
            {this.props.intl.formatMessage({id: 'feedback_detail'})}
          </Button>
        </TableCell>
      </TableRow>
  );

  renderDialogs = () => (
      <div>
        <DialogWithButtons
            title={this.props.intl.formatMessage({id: 'feedback_detail'})}
            description={this.state.feedbackDetailModal && this.feedbackDetails()}
            submitAction={this.props.intl.formatMessage({id: 'close'})}
            isOpen={this.state.feedbackDetailModal}
            submit={() => this.setState({feedbackDetailModal: false})}
            close={() => this.setState({feedbackDetailModal: false})}
        />
        <DialogWithButtons
            title={this.props.intl.formatMessage({id: 'feedback_delete'})}
            description={this.deleteModal()}
            submitAction={this.props.intl.formatMessage({id: 'Yes'})}
            cancelAction={this.props.intl.formatMessage({id: 'cancel'})}
            isOpen={this.state.openDeleteModal}
            submit={() => {
              this.props.deleteFeedback(
                  this.state.selectedFeedback,
                  this.state.currentPage
              );
              this.setState({openDeleteModal: false, feedbackDetailModal: false});
            }}
            close={() =>
                this.setState({openDeleteModal: false, feedbackDetailModal: false})}
        />
      </div>
  );

  render() {
    if (this.props.feedbacksLoading || !this.props.feedbacks.sync) {
      return <FullscreenSpinner/>;
    }

    return (
        <Paper
            style={{
              width: '100vw',
              height: '100vh',
              overflowX: 'auto'
            }}
        >
          {this.renderDialogs()}
          {this.renderProgressBar()}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {this.props.intl.formatMessage({id: 'feedbackId'})}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({id: 'feedback_userId'})}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({id: 'username'})}
                </TableCell>
                <TableCell style={{whiteSpace: 'normal'}}>
                  {this.props.intl.formatMessage({id: 'feedback_rating'})}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({id: 'feedback_date'})}
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
              style={{display: 'flex', justifyContent: 'center'}}
              onChange={this.onPageChange}
              defaultCurrent={this.state.currentPage}
              total={Number(this.props.totalFeedbacks.data[0].count)}
          />
          <TablePagination
              component="div"
              count={100}
              rowsPerPage={10}
              page={0}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={() => {}}
              onChangeRowsPerPage={() => {}}
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
