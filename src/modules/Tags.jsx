import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from 'material-ui/Table';

import Paper from 'material-ui/Paper';
import theme from '../utils/theme';

import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import TextField from 'material-ui/TextField';
import DeleteIcon from 'material-ui-icons/Delete';
import Edit from 'material-ui-icons/Edit';

import { DialogContentText } from 'material-ui/Dialog';
import DialogWithButtons from '../components/DialogWithButtons';

import rest from '../utils/rest';
import InputHandler from '../components/InputHandler';
import Dialog from 'material-ui/Dialog/Dialog';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';

const mapStateToProps = state => ({
  tags: state.filteredTags || state.taglist,
  tagsLoading: state.tags.loading,
  tagDetails: state.tagDetails,
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
    dispatch(rest.actions.tagDetails({ tagId: tag.id }));
  },

  /**
   * Delete a spcific tag
   *
   * @param  {object} tag The to be deleted tag
   * @return {void}
   */
  deleteTagUser: (tag, filter) => {
    dispatch(
      rest.actions.deleteTag.post({ tagId: tag.id }, null, () => {
        if (filter.name) {
          dispatch(rest.actions.taglist.get({ filter: filter }));
        } else {
          dispatch(rest.actions.taglist());
        }
      }),
    );
  },

  filterTags: filter => {
    dispatch(rest.actions.taglist.get({ filter: filter }));
  },

  addTag: newtag => {
    console.log(newtag);
    dispatch(
      rest.actions.addTag(
        null,
        {
          body: JSON.stringify({ name: newtag }),
        },
        () => dispatch(rest.actions.taglist()),
      ),
    );
    /*dispatch(rest.actions.tags(null, {
        body: JSON.stringify({name: newtag.value, category: newtag.category})
    }, () => {
      dispatch(rest.actions.taglist())
    }
    ));*/
  },

  /**
   * Activate the tag
   * @param  {object} tag    The the be activated tag
   * @param  {boolean} checked true: the tag is activated|false: the tag is not activated
   * @return {void}
   */
  activateTag: (tag, checked, filter) => {
    dispatch(
      rest.actions.activateTag.patch(
        { tagId: tag.id },
        { body: JSON.stringify({ checked: checked }) },
        () => {
          if (filter.name) {
            dispatch(rest.actions.taglist.get({ filter: filter }));
          } else {
            dispatch(rest.actions.taglist());
          }
        },
      ),
    );
  },
  update: (tagId, name) => {
    dispatch(
      rest.actions.updateTag.post(
        null,
        { body: JSON.stringify({ tagId, name }) },
        () => {
          dispatch(rest.actions.taglist());
        },
      ),
    );
  },
});

export class Tags extends React.Component {
  // Component initial state.
  // Here we keep track of whether the user details dialog is open.
  state = {
    dialogOpen: false,
    filter: {
      name: '',
    },
  };

  // Refresh user list when component is first mounted
  componentDidMount() {
    const { refresh } = this.props;
    refresh();
  }

  /**
   * Open the delete tag modal
   *
   * @param  {object} tag The to be deleted tag
   * @return {void}
   */
  openDeleteModal = tag => {
    this.setState({
      deleteTagDialogOpen: true,
      toBeDeletedTag: tag,
    });
  };

  openEditModal = tag => {
    this.setState({
      editTagDialogOpen: true,
      toBeEditedTag: tag,
    });
  };

  renderTagDetailsDesc = () => (
    <div>
      <DialogContentText>
        <b>{this.props.intl.formatMessage({ id: 'tagId' })}</b>
        {`: ${this.props.tagDetails.data.id}`}
      </DialogContentText>
    </div>
  );

  renderTagDeleteDesc = () => (
    <div>
      <DialogContentText>
        <strong>
          {this.props.intl.formatMessage({ id: 'deleteTag_description' })}
        </strong>
      </DialogContentText>
    </div>
  );

  renderTagEditDesc = () => (
    <div>
      <DialogContentText>
        <strong>
          {this.props.intl.formatMessage({ id: 'deleteTag_description' })}
        </strong>
      </DialogContentText>
    </div>
  );

  /**
   * Render the tag row in the tag list
   *
   * @param  {object} tag The tag that has to be rendered
   * @return {TableRow} The tablerow associated with the tag
   */
  renderTagRow = tag => (
    <TableRow key={tag.id}>
      <TableCell>{tag.id}</TableCell>
      <TableCell>{tag.name}</TableCell>
      <TableCell>{tag.nbLoves}</TableCell>
      <TableCell>{tag.nbHates}</TableCell>
      <TableCell>{tag.creatorId}</TableCell>
      <TableCell>{moment(tag.createdAt).format('DD-MM-YYYY hh:mm')}</TableCell>
      <TableCell>{tag.relatedEvents}</TableCell>
      <TableCell numeric>
        <FormControlLabel
          control={
            <Switch
              checked={tag.active}
              onChange={(event, checked) =>
                this.props.activateTag(tag, checked, this.state.filter)
              }
            />
          }
          label={
            tag.active
              ? this.props.intl.formatMessage({ id: 'userDetails_deactivate' })
              : this.props.intl.formatMessage({ id: 'userDetails_activate' })
          }
        />
        <Button
          color="primary"
          onClick={() => {
            this.openDeleteModal(tag);
          }}
        >
          <DeleteIcon style={{ paddingRight: 10 }} />
          {this.props.intl.formatMessage({ id: 'deleteUser_delete' })}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            this.openEditModal(tag);
          }}
        >
          <Edit style={{ paddingRight: 10 }} />
          {this.props.intl.formatMessage({ id: 'edit' })}
        </Button>
      </TableCell>
    </TableRow>
  );

  renderDialogs = () => (
    <div>
      <DialogWithButtons
        title={this.props.intl.formatMessage({ id: 'deleteTag_title' })}
        description={this.renderTagDeleteDesc()}
        submitAction={this.props.intl.formatMessage({ id: 'deleteUser_ok' })}
        cancelAction={this.props.intl.formatMessage({
          id: 'deleteUser_cancel',
        })}
        isOpen={this.state.deleteTagDialogOpen}
        submit={() => {
          this.props.deleteTagUser(
            this.state.toBeDeletedTag,
            this.state.filter,
          );
          this.setState({ deleteTagDialogOpen: false });
        }}
        close={() => this.setState({ deleteTagDialogOpen: false })}
      />
      <Dialog
        open={this.state.editTagDialogOpen}
        onClose={() => this.setState({ editTagDialogOpen: false })}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>Update tag name</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tag name"
            type="text"
            fullWidth
            defaultValue={
              this.state.toBeEditedTag ? this.state.toBeEditedTag.name : ''
            }
            onChange={event =>
              this.setState({ newTagName: event.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => this.setState({ editTagDialogOpen: false })}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.props.update(
                this.state.toBeEditedTag.id,
                this.state.newTagName
                  ? this.state.newTagName
                  : this.state.toBeEditedTag.name,
              );
              this.setState({ editTagDialogOpen: false });
            }}
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

  /**
   * Render the tag list
   *
   * @return {Node}
   */
  render() {
    return (
      <div>
        {this.renderDialogs()}
        <Grid container style={{ width: '100vw' }}>
          <Grid item xs={12}>
            <Paper style={theme.paper}>
              {/*InputHandler handels both filtering and add new tag. is found in components*/}
              <InputHandler
                btnName="Go"
                labelName="Filter"
                onSubmit={(value, fields) => {
                  this.setState({ filter: { name: value, ...fields } }, () => {
                    this.props.filterTags({ name: value });
                  });
                }}
              />

              <InputHandler
                btnName="+ Add"
                labelName="+ Add new tag"
                addTags
                submitOnClear={false}
                onSubmit={newTag => {
                  this.props.addTag(newTag.value);
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'tagId' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'tagName' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'tagLoves' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'tagHates' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'tagCreator' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'tagCreationdate' })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({ id: 'tagRelatedEvent' })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {// Loop over each user and render a <TableRow>
            this.props.tags.data.map(tag => this.renderTagRow(tag))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Tags),
);
