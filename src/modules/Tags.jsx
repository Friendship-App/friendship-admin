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

import { LinearProgress } from 'material-ui/Progress';
import ListIcon from 'material-ui-icons/List';
import DeleteIcon from 'material-ui-icons/Delete';
import WarningIcon from 'material-ui-icons/Warning';

import { DialogContentText } from 'material-ui/Dialog';
import DialogWithButtons from '../components/DialogWithButtons';

import rest from '../utils/rest';

const mapStateToProps = state => ({
  tags: state.taglist,
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
     dispatch(rest.actions.tagDetails({tagId: tag.id}))
   }
});

export class Tags extends React.Component {
  // Component initial state.
  // Here we keep track of whether the user details dialog is open.
  state = {
    dialogOpen: false,
  };

// Refresh user list when component is first mounted
componentDidMount() {
  const { refresh } = this.props;
  refresh();
}

renderTagDetailsDesc = () =>
  <div>
    <DialogContentText>
      <b>
        {this.props.intl.formatMessage({ id: 'tagId'})}
      </b>
      {`: ${this.props.tagDetails.data.id}`}
    </DialogContentText>
  </div>;

  /**
   * Render the user row in the user list
   *
   * @param  {object} user The user that has to be rendered
   * @return {TableRow} The tablerow associated with the user
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
        {tag.createdAt}
      </TableCell>
      <TableCell>
        {tag.relatedEvents}
      </TableCell>
    </TableRow>;

    /**
     * Render the tag list
     *
     * @return {Node}
     */
  render() {
    return(
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {this.props.intl.formatMessage({ id: 'tagId' })}
            </TableCell>
            <TableCell>
              {this.props.intl.formatMessage({ id: 'name' })}
            </TableCell>
            <TableCell>
              {this.props.intl.formatMessage({ id: 'Loves' })}
            </TableCell>
            <TableCell>
              {this.props.intl.formatMessage({ id: 'Hates' })}
            </TableCell>
            <TableCell>
              {this.props.intl.formatMessage({ id: 'Creator' })}
            </TableCell>
            <TableCell>
              {this.props.intl.formatMessage({ id: 'Creation date' })}
            </TableCell>
            <TableCell>
              {this.props.intl.formatMessage({ id: 'related events' })}
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
    );
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Tags));
