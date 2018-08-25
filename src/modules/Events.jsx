import React from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import moment from 'moment';
import theme from '../utils/theme';
import {CSVLink} from 'react-csv';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField'
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from 'material-ui/Table';
import {FormControlLabel} from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import {MenuItem} from 'material-ui/Menu';
import {FormControl, FormHelperText} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';

import {LinearProgress} from 'material-ui/Progress';
import ListIcon from 'material-ui-icons/List';
import DeleteIcon from 'material-ui-icons/Delete';
import WarningIcon from 'material-ui-icons/Warning';
import CreateIcon from 'material-ui-icons/Create';
import ArrowDropDownCircle from 'material-ui-icons/ArrowDropDownCircle';

import {DialogContentText} from 'material-ui/Dialog';
import DialogWithButtons from '../components/DialogWithButtons';

import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import InputHandler from '../components/InputHandler';


import rest from '../utils/rest';

// Here we 'connect' the component to the Redux store. This means that the component will receive
// parts of the Redux store as its props. Exactly which parts is chosen by mapStateToProps.

// We should map only necessary values as props, in order to avoid unnecessary re-renders. In this
// case we need the list of users, as returned by the REST API. The component will be able to access
// the users list via `this.props.users`. Additionally, we need details about the selected user,
// which will be available as `this.props.userDetails`.

// The second function (mapDispatchToProps) allows us to 'make changes' to the Redux store, by
// dispatching Redux actions. The functions we define here will be available to the component as
// props, so in our example the component will be able to call `this.props.refresh()` in order to
// refresh the users list, and `this.props.refreshUser(user)` to fetch more info about a specific
// user.

// More details: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options

// The injectIntl decorator makes this.props.intl.formatMessage available to the component, which
// is used for localization.

const mapStateToProps = state => ({
  events: state.events,
});

const mapDispatchToProps = dispatch => ({
  refresh : (filter = '') => dispatch(rest.actions.events(filter)),
  deleteEvent: eventId => dispatch(rest.actions.deleteEvent({eventId}, {}, () => {dispatch(rest.actions.events(''))}))
});

export class Users extends React.Component {
  // Component initial state.
  // Here we keep track of whether the user details dialog is open.
  state = {};

// Refresh user list when component is first mounted
  componentWillMount() {
    const {refresh} = this.props;

    refresh();
  }

  renderProgressBar() {
    const {events} = this.props;
    return events.loading || events.syncing
      ? <div style={ {marginBottom: '-5px'} }>
        <LinearProgress/>
      </div>
      : null;
  }

  /**
   * Open the delete user modal
   *
   * @param  {object} user The to be deleted user
   * @return {void}
   */
  openDeleteModal = (event) => {
    this.setState({
      deleteUserDialogOpen: true,
      toBeDeletedEvent: event
    });
  }

  /**
   * Open the ban user modal
   *
   * @param  {object} user the to be banned user
   * @return {void}
   */
  openBanModal = (user) => {
    this.setState({
      banUserDialogOpen: true,
      toBeBannedUser: user
    })
  }

  /**
   * Open the unban user modal
   *
   * @param  {object} user the to be unbanned user
   * @return {void}
   */
  openUnbanModal = user =>
    this.setState({
      unbanUserDialogOpen: true,
      toBeUnbannedUser: user
    })

  /**
   * Open the edit user modal
   *
   * @param  {object} user the to be edited user
   * @return {void}
   */
  openEditUserModal = (user) => {
    this.setState({
      editUserDialogOpen: true,
      toBeEditedUser: user
    })
  }


  renderEditUser = () =>
    <div>
      <TextField
        id="username"
        label="Username"
        defaultValue={ this.state.toBeEditedUser ? this.state.toBeEditedUser.username : '' }
        value={ this.state.editUserInfo.username }
        onChange={ (event) => {
          this.setState({editUserInfo: {...this.state.editUserInfo, username: event.target.value}})
        } }
        margin="normal"
      />
      <br/>
      <TextField
        id="userEmail"
        label="E-Mail"
        defaultValue={ this.state.toBeEditedUser ? this.state.toBeEditedUser.email : '' }
        value={ this.state.editUserInfo.email }
        onChange={ (event) => {
          this.setState({editUserInfo: {...this.state.editUserInfo, email: event.target.value}})
        } }
        margin="normal"
      />
      <br/>
      <InputLabel htmlFor="password">Password</InputLabel>
      <br/>
      <Input
        id="password"
        value={ this.state.editUserInfo.password }
        type="password"
        onChange={ (event) => {
          this.setState({editUserInfo: {...this.state.editUserInfo, password: event.target.value}})
        } }
      />
    </div>

  renderUserDetailsDesc = () =>
    <div>
      <DialogContentText>
        <b>
          { this.props.intl.formatMessage({id: 'userId'}) }
        </b>
        { `: ${this.props.userDetails.data.id}` }
      </DialogContentText>
      <DialogContentText>
        <b>
          { this.props.intl.formatMessage({id: 'username'}) }
        </b>
        { `: ${this.props.userDetails.data.username}` }
      </DialogContentText>
      <DialogContentText>
        <b>
          { this.props.intl.formatMessage({id: 'userEmail'}) }
        </b>
        { `: ${this.props.userDetails.data.email}` }
      </DialogContentText>
      <DialogContentText>
        <b>
          { this.props.intl.formatMessage({id: 'status'}) }
        </b>
        { `: ${this.props.userDetails.data.isbanned === '1' ? this.props.intl.formatMessage({id: 'status_banned'}) : this.props.userDetails.data.status}` }
      </DialogContentText>
      <DialogContentText>
        <b>
          { this.props.intl.formatMessage({id: 'createdAt'}) }
        </b>
        { `: ${moment(this.props.userDetails.data.createdAt).format('DD-MM-YYYY hh:mm')}` }
      </DialogContentText>
      <DialogContentText>
        <b>
          { this.props.intl.formatMessage({id: 'userDescription'}) }
        </b>
        { `: ${this.props.userDetails.data.description}` }
      </DialogContentText>
    </div>
  ;

  /**
   * Render the user delete dialog description
   *
   * @return {Node}
   */
  renderUserDeleteDesc = () =>
    <div>
      <DialogContentText>
        <strong>
          { this.props.intl.formatMessage({id: 'deleteUser_description'}) }
        </strong>
      </DialogContentText>
    </div>
  ;

  renderUserBanDesc = () =>
    <div style={ {display: 'flex'} }>
      <FormControl>
        <TextField
          id="expire-time"
          label={ this.props.intl.formatMessage({id: 'banUser_amount'}) }
          margin="normal"
          type={ "number" }
          onChange={ (event) => {
            this.setState({
              banInfo: {
                ...this.state.banInfo,
                expire: {...this.state.banInfo.expire, amount: event.target.value}
              }
            })
          }
          }
        />
        <FormHelperText>{ this.props.intl.formatMessage({id: 'banUser_choose'}) }</FormHelperText>
      </FormControl>
      <TextField
        id="expire-indicator"
        select
        label={ this.props.intl.formatMessage({id: 'banUser_indicator'}) }
        value={ this.state.banInfo.expire.indicator }
        onChange={ (event) => this.setState({
          banInfo: {
            ...this.state.banInfo,
            expire: {...this.state.banInfo.expire, indicator: event.target.value}
          }
        }) }
        margin="normal"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="hours">{ this.props.intl.formatMessage({id: 'banUser_indicator_hours'}) }</MenuItem>
        <MenuItem value="days">{ this.props.intl.formatMessage({id: 'banUser_indicator_days'}) }</MenuItem>
        <MenuItem value="weeks">{ this.props.intl.formatMessage({id: 'banUser_indicator_weeks'}) }</MenuItem>
        <MenuItem value="years">{ this.props.intl.formatMessage({id: 'banUser_indicator_years'}) }</MenuItem>
      </TextField>


    </div>
  ;

  /**
   * Render the user row in the user list
   *
   * @param  {object} user The user that has to be rendered
   * @return {TableRow} The tablerow associated with the user
   */
  renderRow = (event) => {
    console.log(event);
    return (
      <TableRow key={ event.id }
                style={ {backgroundColor: event.reports > 0 ? theme.palette.error[ 100 ] : null} }>
        <TableCell>
          { event.id }
        </TableCell>
        <TableCell>
          { event.title }
        </TableCell>
        <TableCell>
          { event.eventImage }
        </TableCell>
        <TableCell>
          { event.reports }
        </TableCell>
        <TableCell>
          { moment(event.createdAt).format('DD-MM-YYYY hh:mm') }
        </TableCell>
        {/*<TableCell>
          { user.isbanned === "1" ? this.props.intl.formatMessage({id: 'banned'}) : (user.active ? this.props.intl.formatMessage({id: 'active'}) : this.props.intl.formatMessage({id: 'inactive'})) }
        </TableCell>*/}
        <TableCell numeric>
          <FormControlLabel
            control={
              <Switch
                checked={ event.active }
                onChange={ (event, checked) => {
                  // this.props.activateUser(user, checked, this.state.filter)
                } }
              />
            }
            label={ event.active ? this.props.intl.formatMessage({id: 'userDetails_deactivate'}) : this.props.intl.formatMessage({id: 'userDetails_activate'}) }
          />
          <Button
            color="primary"
            onClick={ () => {
              this.openDeleteModal(event)
            } }>
            <DeleteIcon style={ {paddingRight: 10} }/>
            { this.props.intl.formatMessage({id: 'deleteUser_delete'}) }
          </Button>
        </TableCell>
      </TableRow>
    )
  };

  /**
   * Render the dialogs
   * @return {Node} The dialogs
   */
  renderDialogs = () =>
    <div>
      <DialogWithButtons
        title={ this.props.intl.formatMessage({id: 'deleteUser_title'}) }
        description={ this.renderUserDeleteDesc() }
        submitAction={ this.props.intl.formatMessage({id: 'deleteUser_ok'}) }
        cancelAction={ this.props.intl.formatMessage({id: 'deleteUser_cancel'}) }
        isOpen={ this.state.deleteUserDialogOpen }
        submit={ () => {
          this.props.deleteEvent(this.state.toBeDeletedEvent.id);
          this.setState({deleteUserDialogOpen: false})
        } }
        close={ () => this.setState({deleteUserDialogOpen: false}) }
      />
    </div>
  ;

  /**
   * Render the user list
   *
   * @return {Node}
   */
  render() {
    return (
      <div style={ {width: '100vw'} }>
        {this.renderDialogs()}
        {this.renderProgressBar()}
        { /*<Grid container>
          <Grid item xs={12}>
            <Paper style={theme.paper}>
              <InputHandler
                btnName="Go"
                labelName="Filter"
                onSubmit={(value, fields) => this.props.refresh(value)}
              />
            </Paper>
          </Grid>
        </Grid>*/ }
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                { this.props.intl.formatMessage({id: 'eventId'}) }
              </TableCell>
              <TableCell>
                { this.props.intl.formatMessage({id: 'eventTitle'}) }
              </TableCell>
              <TableCell>
                { this.props.intl.formatMessage({id: 'eventImage'}) }
              </TableCell>
              <TableCell>
                { this.props.intl.formatMessage({id: 'reports'}) }
              </TableCell>
              <TableCell>
                { this.props.intl.formatMessage({id: 'createdAt'}) }
              </TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>

          <TableBody>
            {this.props.events.data.map(event => {return this.renderRow(event)})}
          </TableBody>
        </Table>
        <br/>
      </div>
    );
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Users));
