import React from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import moment from 'moment';

import Button from 'material-ui/Button';
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from 'material-ui/Table';


import {FormControlLabel} from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import DeleteIcon from 'material-ui-icons/Delete';

import {DialogContentText} from 'material-ui/Dialog';
import DialogWithButtons from '../components/DialogWithButtons';

import rest from '../utils/rest';
import Filter from "../components/Filter";

const mapStateToProps = state => ({
  tags: state.filteredTags || state.taglist,
  tagsLoading: state.tags.loading,
  tagDetails: state.tagDetails
});

const mapDispatchToProps = dispatch => ({

  /**
   * Refresh the tags list
   *
   * @return {void}
   */
  refresh: () => {
    dispatch(rest.actions.taglist());
  },

  /**
   * Refresh a spcific user
   *
   * @param  {Object} tag The tag to be refreshed
   * @return {void}
   */
  refreshTag: tag => {
    dispatch(rest.actions.tagDetails({tagId: tag.id}))
  },

  /**
   * Delete a spcific tag
   *
   * @param  {object} tag The to be deleted tag
   * @return {void}
   */
  deleteTagUser: (tag, filter) => {
    dispatch(rest.actions.tagDetails.delete({tagId: tag.id}, null, () => {
      if (filter.name) {
        dispatch(rest.actions.taglist.get({filter: filter}));
      }
      else {
        dispatch(rest.actions.taglist());
      }
    }));
  },

  filterTags: (filter) => {
    dispatch(rest.actions.taglist.get({filter: filter}));
  },

  /**
   * Activate the tag
   * @param  {object} tag    The the be activated tag
   * @param  {boolean} checked true: the tag is activated|false: the tag is not activated
   * @return {void}
   */
  activateTag: (tag, checked, filter) => {
    dispatch(rest.actions.tagDetails.patch({tagId: tag.id}, {body: JSON.stringify({activated: checked})}, () => {
      if (filter.name) {
        dispatch(rest.actions.taglist.get({filter: filter}));
      }
      else {
        dispatch(rest.actions.taglist());
      }
    }))
  }
});


export class Tags extends React.Component {
  // Component initial state.
  // Here we keep track of whether the user details dialog is open.
  state = {
    dialogOpen: false,
    filter: {
      name: ''
    }
  };

// Refresh user list when component is first mounted
  componentDidMount() {
    const {refresh} = this.props;
    refresh();
  }

  /**
   * Open the delete tag modal
   *
   * @param  {object} tag The to be deleted tag
   * @return {void}
   */
  openDeleteModal = (tag) => {
    this.setState({
      deleteTagDialogOpen: true,
      toBeDeletedTag: tag
    });
  }

  renderTagDetailsDesc = () =>
    <div>
      <DialogContentText>
        <b>
          {this.props.intl.formatMessage({id: 'tagId'})}
        </b>
        {`: ${this.props.tagDetails.data.id}`}
      </DialogContentText>
    </div>;

  renderTagDeleteDesc = () =>
    <div>
      <DialogContentText>
        <strong>
          {this.props.intl.formatMessage({id: 'deleteTag_description'})}
        </strong>
      </DialogContentText>
    </div>;

  /**
   * Render the tag row in the tag list
   *
   * @param  {object} tag The tag that has to be rendered
   * @return {TableRow} The tablerow associated with the tag
   */
  renderTagRow = (tag) =>
    <TableRow key={tag.id}>
      <TableCell>
        {tag.id}
      </TableCell>
      <TableCell>
        {tag.name}
      </TableCell>
      <TableCell>
        {tag.nbLoves}
      </TableCell>
      <TableCell>
        {tag.nbHates}
      </TableCell>
      <TableCell>
        {tag.creator}
      </TableCell>
      <TableCell>
        {tag.status ? "1" : "2"}
      </TableCell>
      <TableCell>
        {moment(tag.createdAt).format('DD-MM-YYYY hh:mm')}
      </TableCell>
      <TableCell>
        {tag.relatedEvents}
      </TableCell>
      <TableCell numeric>
        <FormControlLabel
          control={
            <Switch
              checked={tag.status}
              onChange={(event, checked) => this.props.activateTag(tag, checked, this.state.filter)}
            />
          }
          label={this.props.intl.formatMessage({id: 'userDetails_activate'})}
        />
        <Button
          color="primary"
          onClick={() => {
            this.openDeleteModal(tag)
          }}>
          <DeleteIcon style={{paddingRight: 10}}/>
          {this.props.intl.formatMessage({id: 'deleteUser_delete'})}
        </Button>
      </TableCell>
    </TableRow>;

  renderDialogs = () =>
    <div>
      <DialogWithButtons
        title={this.props.intl.formatMessage({id: 'deleteTag_title'})}
        description={this.renderTagDeleteDesc()}
        submitAction={this.props.intl.formatMessage({id: 'deleteUser_ok'})}
        cancelAction={this.props.intl.formatMessage({id: 'deleteUser_cancel'})}
        isOpen={this.state.deleteTagDialogOpen}
        submit={() => {
          this.props.deleteTagUser(this.state.toBeDeletedTag, this.state.filter);
          this.setState({deleteTagDialogOpen: false})

        }}
        close={() => this.setState({deleteTagDialogOpen: false})}
      />
    </div>

  /**
   * Render the tag list
   *
   * @return {Node}
   */
  render() {
    return (
      <div>
        {this.renderDialogs()}
        <Filter
          onFilter={(value, fields) => {
            this.setState({filter: {name: value, ...fields}}, () => {
              this.props.filterTags({name: value});
            });
          }}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {this.props.intl.formatMessage({id: 'tagId'})}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({id: 'tagName'})}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({id: 'tagLoves'})}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({id: 'tagHates'})}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({id: 'tagCreator'})}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({id: 'tagStatus'})}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({id: 'tagCreationdate'})}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({id: 'tagRelatedEvent'})}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {// Loop over each user and render a <TableRow>
              this.props.tags.data.map(tag =>
                this.renderTagRow(tag)
              )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Tags));
