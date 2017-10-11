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
  //reportsLoading: state.reports.loading,
  reportDetails: state.reportDetails,
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
   * Refresh a spcific report
   *
   * @param  {Object} report The report to be refreshed
   * @return {void}
   */
  refreshReport: report => {
    dispatch(rest.actions.reportDetails({ reportId: report.id }));
  },

});

export class Reports extends React.Component {

  // Refresh report list when component is first mounted
  componentDidMount() {
    const { refresh } = this.props;

    refresh();
  }


  renderProgressBar() {
    const { reportsLoading } = this.props;
    return reportsLoading
      ? <div style={{ marginBottom: '-5px' }}>
          <LinearProgress />
        </div>
      : null;
  }

  renderReportRow = (report) =>
    <TableRow key={report.id}>
      <TableCell>
        {report.id}
      </TableCell>
      <TableCell>
        {report.email}
      </TableCell>
    </TableRow>;

  render() {

    return (
      <div>

        {this.renderProgressBar()}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'reportId' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'email' })}
              </TableCell>
              <TableCell />
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
