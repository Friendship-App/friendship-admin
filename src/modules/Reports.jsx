import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField'
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from 'material-ui/Table';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

import { LinearProgress } from 'material-ui/Progress';
import ListIcon from 'material-ui-icons/List';
import DeleteIcon from 'material-ui-icons/Delete';
import WarningIcon from 'material-ui-icons/Warning';
import NumberFormat from 'react-number-format';

import { DialogContentText } from 'material-ui/Dialog';
import DialogWithButtons from '../components/DialogWithButtons';

import rest from '../utils/rest';

// Here we 'connect' the component to the Redux store. This means that the component will receive
// parts of the Redux store as its props. Exactly which parts is chosen by mapStateToProps.

// We should map only necessary values as props, in order to avoid unnecessary re-renders. In this
// case we need the list of reports, as returned by the REST API. The component will be able to access
// the reports list via `this.props.reports`. Additionally, we need details about the selected report,
// which will be available as `this.props.userDetails`.

// The second function (mapDispatchToProps) allows us to 'make changes' to the Redux store, by
// dispatching Redux actions. The functions we define here will be available to the component as
// props, so in our example the component will be able to call `this.props.refresh()` in order to
// refresh the reports list, and `this.props.refreshUser(report)` to fetch more info about a specific
// report.

// More details: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options

// The injectIntl decorator makes this.props.intl.formatMessage available to the component, which
// is used for localization.

const mapStateToProps = state => ({
  reports: state.reports,
  reportsLoading: state.reports.loading,
  reportDetails: state.reportDetails,
  userDetails: state.userDetails,
});

const mapDispatchToProps = dispatch => ({

  /**
   * Refresh the report list
   *
   * @return {void}
   */
  refresh: () => {
    dispatch(rest.actions.reports());
  },

  /**
   * Refresh a specific report
   *
   * @param  {Object} reports The user to be refreshed
   * @return {void}
   */
  refreshReport: (report) => {
    dispatch(rest.actions.reportDetails({ reportId: report.id }));
  },
// get report into props, map to open dialog
  /**
   * Delete a specific report
   *
   * @param  {object} report The to be deleted report
   * @return {void}
   */
  deleteReport: (report) => {
      dispatch(rest.actions.reportDetails.delete({ reportId: report.id }, null, () => {
          dispatch(rest.actions.reports());
      }));
  },



  /**
   * Refresh a specific report
   *
   * @param  {Object} report The report to be refreshed
   * @return {void}
   */
  refreshUser: user => {
    dispatch(rest.actions.userDetails({ userId: user }));
  },

  /**
   * Refresh a specific user
   *
   * @param  {Object} user The user to be refreshed
   * @return {void}
   */
  getUserDetails: (user) => {
    const info = {
      userId: user,
    }
    dispatch(rest.actions.userDetails(null ,{ userId: user}));
  },
});

export class Reports extends React.Component {
  state = {
    dialogOpen: false,
    deleteReportDialogOpen: false,
    toBeDeletedReport: null,
    reportDescriptionDialog: false,
    toBeShownReportDescription: null,
  };

  // Refresh report list when component is first mounted
  componentDidMount() {
    const { refresh } = this.props;

    refresh();
  }

// Allows you to render the side naviagtion bar
  renderProgressBar() {
    const { reportsLoading } = this.props;
    return reportsLoading
      ? <div style={{ marginBottom: '-5px' }}>
          <LinearProgress />
        </div>
      : null;
  }

  /**
   * Open the delete report modal
   *
   * @param  {object} report The to be deleted report
   * @return {void}
   */
  openDeleteModal = (report) => {
    this.setState({
        deleteReportDialogOpen: true,
        toBeDeletedReport: report
    });
  }

  //  Render the description for the report dialogue
   renderReportDesc = () =>
   <div>
     <DialogContentText>
        <b>
            {this.props.intl.formatMessage({ id: 'reportDescription' })}
        </b>
          {`: ${this.props.reportDetails.data.description}`}
     </DialogContentText>
  </div>;

    renderUserDetailsDesc = () =>
      <div>
        <DialogContentText>
          <b>
            {this.props.intl.formatMessage({ id: 'userId' })}
          </b>
          {`: ${this.props.userDetails.data.id}`}
        </DialogContentText>
        <DialogContentText>
          <b>
            {this.props.intl.formatMessage({ id: 'username' })}
          </b>
          {`: ${this.props.userDetails.data.username}`}
        </DialogContentText>
        <DialogContentText>
          <b>
            {this.props.intl.formatMessage({ id: 'email' })}
          </b>
          {`: ${this.props.userDetails.data.email}`}
        </DialogContentText>
        <DialogContentText>
          <b>
            {this.props.intl.formatMessage({ id: 'status' })}
          </b>
          {`: ${this.props.userDetails.data.status}`}
        </DialogContentText>
        <DialogContentText>
          <b>
            {this.props.intl.formatMessage({ id: 'createdAt' })}
          </b>
          {`: ${this.props.userDetails.data.createdAt}`}
        </DialogContentText>
        <DialogContentText>
          <b>
            {this.props.intl.formatMessage({ id: 'description' })}
          </b>
          {`: ${this.props.userDetails.data.description}`}
        </DialogContentText>
      </div>;

  /**
   * Render the report delete dialog description
   *
   * @return {Node}
   */
   renderReportDeleteDesc = () =>
     <div>
         <DialogContentText>
             <strong>
                 {this.props.intl.formatMessage({ id: 'deleteReport_description' })}
             </strong>
         </DialogContentText>
     </div>;

  renderReportRow = (report) =>
    <TableRow key={report.id}>
      <TableCell>
        {report.id}
      </TableCell>
      <TableCell>
        {report.userId}
      </TableCell>
      <TableCell>
        {report.createdAt}
      </TableCell>
      <TableCell>
        {report.reported_by}
      </TableCell>
      <TableCell numeric>

      <Button
          color="primary"
          onClick={() => {
              this.openDeleteModal(report)
          }}>
          <DeleteIcon style={{ paddingRight: 10 }} />
          {this.props.intl.formatMessage({ id: 'deleteReport_delete' })}
      </Button>

      <Button
        color="primary"
        onClick={() => {
          this.props.refreshUser(report.userId);
          this.setState({ userDetailsOpen: true });
        }}
      >
        <ListIcon style={{ paddingRight: 10 }} />
        {this.props.intl.formatMessage({ id: 'userDetails' })}
      </Button>

      <Button
        color="primary"
        onClick={() => {
          this.props.refreshReport(report);
          this.setState({ reportDescriptionDialog: true });
        }}
      >
        <ListIcon style={{ paddingRight: 10 }} />
        {this.props.intl.formatMessage({ id: 'showReportDetails' })}
      </Button>

      </TableCell>
    </TableRow>;


    /**
     * Render the dialogs
     * @return {Node} The dialogs
     */
    renderDialogs = () =>
      <div>
        <DialogWithButtons
          title={this.props.intl.formatMessage({ id: 'reportedUser_details' })}
          description={this.renderUserDetailsDesc()}
          submitAction={this.props.intl.formatMessage({ id: 'close' })}
          isOpen={this.state.userDetailsOpen}
          submit={() => this.setState({ userDetailsOpen: false })}
          close={() => this.setState({ userDetailsOpen: false })}
        />

        <DialogWithButtons
            title={this.props.intl.formatMessage({ id: 'deleteReport' })}
            description={this.renderReportDeleteDesc()}
            submitAction={this.props.intl.formatMessage({ id: 'Yes' })}
            cancelAction={this.props.intl.formatMessage({ id: 'Cancel' })}
            isOpen={this.state.deleteReportDialogOpen}
            submit={() => {
                this.props.deleteReport(this.state.toBeDeletedReport);
                this.setState({ deleteReportDialogOpen: false})

            }}
            close={() => this.setState({ deleteReportDialogOpen: false})}
            />

            <DialogWithButtons
              title={this.props.intl.formatMessage({ id: 'showReportDetails' })}
              description={this.renderReportDesc()}
              submitAction={this.props.intl.formatMessage({ id: 'close' })}
              isOpen={this.state.reportDescriptionDialog}
              submit={() => this.setState({ reportDescriptionDialog: false })}
              close={() => this.setState({ reportDescriptionDialog: false })}
            />
        </div>;


  render() {

    return (
      <div>
        {this.renderDialogs()}
        {this.renderProgressBar()}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'reportId' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'user_id' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'createdAt' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'reported_by' })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {// Loop over each report and render a <TableRow>
            this.props.reports.data.map(report =>
              this.renderReportRow(report)
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Reports));
