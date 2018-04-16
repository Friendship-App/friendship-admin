import React from "react";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";

import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "material-ui/Table";
import {FormControlLabel} from "material-ui/Form";
import Switch from "material-ui/Switch";
import Input, {InputLabel} from "material-ui/Input";
import {MenuItem} from "material-ui/Menu";
import {FormControl, FormHelperText} from "material-ui/Form";
import Select from "material-ui/Select";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

import {LinearProgress} from "material-ui/Progress";
import ListIcon from "material-ui-icons/List";
import DeleteIcon from "material-ui-icons/Delete";
import WarningIcon from "material-ui-icons/Warning";
import NumberFormat from "react-number-format";
import {DialogContentText} from "material-ui/Dialog";
import DialogWithButtons from "../components/DialogWithButtons";
import rest from "../utils/rest";
import FullscreenSpinner from "../components/FullscreenSpinner";

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
  userDetails: state.userDetails,
  totalReports: state.totalReports
});

const mapDispatchToProps = dispatch => ({
  /**
   * Refresh the report list
   *
   * @return {void}
   */
  refresh: startIndex => {
    dispatch(rest.actions.reports({startIndex}));
  },

  getTotalReports: () => {
    dispatch(rest.actions.totalReports());
  },

  /**
   * Refresh a specific report
   *
   * @param  {Object} user The user to be refreshed
   * @return {void}
   */
  refreshReport: report => {
    dispatch(rest.actions.reportDetails({reportId: report.id}));
  },

  /**
   * Delete a spcific report
   *
   * @param  {object} report The to be deleted report
   * @return {void}
   */
  deleteReport: report => {
    dispatch(
        rest.actions.reportDetails.delete({reportId: report.id}, null, () => {
          dispatch(rest.actions.reports({startIndex: 1}));
        })
    );
  },

  /**
   * Refresh a spcific report
   *
   * @param  {Object} report The report to be refreshed
   * @return {void}
   */
  refreshUser: user => {
    dispatch(rest.actions.userDetails({userId: user}));
  },

  /**
   * Refresh a spcific user
   *
   * @param  {Object} user The user to be refreshed
   * @return {void}
   */
  getUserDetails: user => {
    dispatch(rest.actions.userDetails({userId: user}));
  },

  banUser: (user, banInfo) => {
    const info = {
      reason: banInfo.reason,
      expire:
          banInfo.expire.amount === "" || banInfo.expire.indicator === ""
              ? "x"
              : banInfo.expire.amount + ":" + banInfo.expire.indicator
    };

    dispatch(
        rest.actions.banUser(
            {userId: user.id},
            {
              body: JSON.stringify(info)
            },
            () => {
              dispatch(rest.actions.users());
            }
        )
    );
  }
});

export class Reports extends React.Component {
  state = {
    dialogOpen: false,
    deleteReportDialogOpen: false,
    toBeDeletedReport: null,
    banUserDialogOpen: false,
    toBeBannedUser: null,
    currentPage: 1,
    banInfo: {
      reason: "",
      expire: {
        amount: "",
        indicator: ""
      }
    }
  };

  // Refresh report list when component is first mounted
  componentWillMount() {
    console.log('Will nount ...');
    const {refresh, getTotalReports} = this.props;
    getTotalReports();
    refresh(1);
  }

  // Allows you to render the side naviagtion bar
  renderProgressBar() {
    const {reportsLoading} = this.props;
    return reportsLoading ? (
        <div style={{marginBottom: "-5px"}}>
          <LinearProgress/>
        </div>
    ) : null;
  }

  /**
   * Open the delete report modal
   *
   * @param  {object} report The to be deleted report
   * @return {void}
   */
  openDeleteModal = report => {
    this.setState({
      deleteReportDialogOpen: true,
      toBeDeletedReport: report
    });
  };

  /**
   * Open the ban user modal
   *
   * @param  {object} user the to be banned user
   * @return {void}
   */
  async openBanModal(user) {
    await this.props.getUserDetails(user);
    this.setState({
      banUserDialogOpen: true,
      toBeBannedUser: this.props.userDetails.data
    });
  }

  onPageChange = page => {
    console.log(page);
    let nextStartIndex = page === 1 ? 1 : parseInt(page + "0");
    this.setState({
      currentPage: page
    });
    this.props.getTotalReports();
    this.props.refresh(
        nextStartIndex
    );
    /** in the back-end this is called offset, but here startIndex is better naming.https://www.postgresql.org/docs/8.0/static/queries-limit.html*/
  };

  renderUserDetailsDesc = () => (
      <div>
        <DialogContentText>
          <b>{this.props.intl.formatMessage({id: "userId"})}</b>
          {`: ${this.props.userDetails.data.id}`}
        </DialogContentText>
        <DialogContentText>
          <b>{this.props.intl.formatMessage({id: "username"})}</b>
          {`: ${this.props.userDetails.data.username}`}
        </DialogContentText>
        <DialogContentText>
          <b>{this.props.intl.formatMessage({id: "email"})}</b>
          {`: ${this.props.userDetails.data.email}`}
        </DialogContentText>
        <DialogContentText>
          <b>{this.props.intl.formatMessage({id: "status"})}</b>
          {`: ${this.props.userDetails.data.status}`}
        </DialogContentText>
        <DialogContentText>
          <b>{this.props.intl.formatMessage({id: "createdAt"})}</b>
          {`: ${this.props.userDetails.data.createdAt}`}
        </DialogContentText>
        <DialogContentText>
          <b>{this.props.intl.formatMessage({id: "description"})}</b>
          {`: ${this.props.userDetails.data.description}`}
        </DialogContentText>
      </div>
  );

  renderUserBanDesc = () => (
      <div style={{display: "flex"}}>
        <FormControl>
          <TextField
              id="expire-time"
              label={this.props.intl.formatMessage({id: "banUser_amount"})}
              margin="normal"
              type={"number"}
              onChange={event => {
                this.setState({
                  banInfo: {
                    ...this.state.banInfo,
                    expire: {
                      ...this.state.banInfo.expire,
                      amount: event.target.value
                    }
                  }
                });
              }}
          />
          <FormHelperText>
            {this.props.intl.formatMessage({id: "banUser_choose"})}
          </FormHelperText>
        </FormControl>
        <TextField
            id="expire-indicator"
            select
            label={this.props.intl.formatMessage({id: "banUser_indicator"})}
            value={this.state.banInfo.expire.indicator}
            onChange={event =>
                this.setState({
                  banInfo: {
                    ...this.state.banInfo,
                    expire: {
                      ...this.state.banInfo.expire,
                      indicator: event.target.value
                    }
                  }
                })}
            margin="normal"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="hours">
            {this.props.intl.formatMessage({id: "banUser_indicator_hours"})}
          </MenuItem>
          <MenuItem value="days">
            {this.props.intl.formatMessage({id: "banUser_indicator_days"})}
          </MenuItem>
          <MenuItem value="weeks">
            {this.props.intl.formatMessage({id: "banUser_indicator_weeks"})}
          </MenuItem>
          <MenuItem value="years">
            {this.props.intl.formatMessage({id: "banUser_indicator_years"})}
          </MenuItem>
        </TextField>
      </div>
  );

  renderReportDeleteDesc = () => (
      <div>
        <DialogContentText>
          <strong>
            {this.props.intl.formatMessage({
              id: "Are you sure you want to delete this report?"
            })}
          </strong>
        </DialogContentText>
      </div>
  );

  renderReportRow = report => (
      <TableRow key={report.id}>
        <TableCell>{report.id}</TableCell>
        <TableCell>{report.userId}</TableCell>
        <TableCell>{report.description}</TableCell>
        <TableCell>{report.createdAt}</TableCell>
        <TableCell>{report.reported_by}</TableCell>
        <TableCell numeric>
          <Button
              color="primary"
              onClick={() => {
                this.openDeleteModal(report);
              }}
          >
            <DeleteIcon style={{paddingRight: 10}}/>
            {this.props.intl.formatMessage({id: "Delete Report"})}
          </Button>
          <Button
              color="primary"
              onClick={() => this.openBanModal(report.userId)}
          >
            <WarningIcon style={{paddingRight: 10}}/>
            {this.props.intl.formatMessage({id: "banUser_ban"})}
          </Button>
          <Button
              color="primary"
              onClick={() => {
                this.props.refreshUser(report.userId);
                this.setState({dialogOpen: true});
              }}
          >
            <ListIcon style={{paddingRight: 10}}/>
            {this.props.intl.formatMessage({id: "showUserDetails"})}
          </Button>
        </TableCell>
      </TableRow>
  );

  /**
   * Render the dialogs
   * @return {Node} The dialogs
   */
  renderDialogs = () => (
      <div>
        <DialogWithButtons
            title={this.props.intl.formatMessage({id: "Reported User details"})}
            description={this.renderUserDetailsDesc()}
            submitAction={this.props.intl.formatMessage({id: "close"})}
            isOpen={this.state.dialogOpen}
            // loading={this.props.reportDetails.loading}
            submit={() => this.setState({dialogOpen: false})}
            close={() => this.setState({dialogOpen: false})}
        />
        <DialogWithButtons
            title={this.props.intl.formatMessage({id: "Delete Report"})}
            description={this.renderReportDeleteDesc()}
            submitAction={this.props.intl.formatMessage({id: "Yes"})}
            cancelAction={this.props.intl.formatMessage({id: "Cancel"})}
            isOpen={this.state.deleteReportDialogOpen}
            submit={() => {
              this.props.deleteReport(this.state.toBeDeletedReport);
              this.setState({deleteReportDialogOpen: false});
            }}
            close={() => this.setState({deleteReportDialogOpen: false})}
        />
        <DialogWithButtons
            textField={{
              label: this.props.intl.formatMessage({id: "banUser_reason"}),
              fullWidth: true
            }}
            title={
              this.props.intl.formatMessage({id: "banUser_title"}) +
              " " +
              (this.props.userDetails.data
                  ? this.props.userDetails.data.username
                  : "")
            }
            description={this.renderUserBanDesc()}
            submitAction={this.props.intl.formatMessage({id: "banUser_ok"})}
            cancelAction={this.props.intl.formatMessage({id: "banUser_cancel"})}
            isOpen={this.state.banUserDialogOpen}
            submit={data => {
              this.setState(
                  {banInfo: {...this.state.banInfo, reason: data.value}},
                  () => {
                    this.props.banUser(
                        this.props.userDetails.data,
                        this.state.banInfo,
                        this.state.filter
                    );
                    this.setState({
                      banInfo: {reason: "", expire: {amount: "", indicator: ""}},
                      banUserDialogOpen: false
                    });
                  }
              );
            }}
            close={() => {
              this.setState({
                banInfo: {reason: "", expire: {amount: "", indicator: ""}},
                banUserDialogOpen: false
              });
            }}
        />
      </div>
  );

  render() {
    if (this.props.totalReports.loading || !this.props.totalReports.sync || this.props.reports.loading || !this.props.reports.sync) {
      return <FullscreenSpinner/>;
    }

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
          {this.renderDialogs()}
          {this.renderProgressBar()}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {this.props.intl.formatMessage({id: "reportId"})}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({id: "user_id"})}
                </TableCell>
                <TableCell style={{whiteSpace: "normal"}}>
                  {this.props.intl.formatMessage({id: "description"})}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({id: "createdAt"})}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({id: "reported_by"})}
                </TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {// Loop over each report and render a <TableRow>
                this.props.reports.data.map(report => this.renderReportRow(report))}
            </TableBody>
          </Table>
          <Pagination
              className="ant-pagination"
              onChange={this.onPageChange}
              defaultCurrent={this.state.currentPage}
              total={this.props.totalReports.data[0].count}
          />
        </div>
    );
  }

  // const style = {
  //    wordWrap: 'break-word'
  //    maxwidth: 20px
  // };
}

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(Reports)
);
