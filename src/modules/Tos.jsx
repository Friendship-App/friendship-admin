import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

import DialogWithButtons from '../components/DialogWithButtons';
import { DialogContentText } from 'material-ui/Dialog';

import rest from '../utils/rest';

const mapStateToProps = state => ({
  tos: state.tos.data,
});

const mapDispatchToProps = dispatch => ({
  /**
  * Refresh the user list
  *
  * @return {void}
  */
  refresh: () => {
    dispatch(rest.actions.latestTos());
  },

/**
   * create new terms of service
   *
   * @param  String The to be created tos with tos text
   * @return {void}
   */
  createTos: (tosInfo) => {
    const info = {
      tos_text: tosInfo,
    }
    dispatch(rest.actions.createTos(null, {
        body: JSON.stringify(info)
    }, () => {
      dispatch(rest.actions.latestTos())}
    ));
  },

});

const textareaStyle = {
    marginLeft: '10vw',
    marginTop: '5vw',
    width: '80%',
}

const buttonStyle = {
    marginLeft: '10vw',
}

export class Tos extends React.Component {
  // Component initial state.
  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      multiline: props.tos.tos_text,
      saveTosDialogOpen: false,
    }
  }
 
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  // Refresh user list when component is first mounted
  componentDidMount() {
    const { refresh } = this.props;

    refresh();
  }

  render() {

    return (
      <div style={{width:'100vw'}}>
        {this.renderDialog()}
        <div>
          <TextField 
          id="multiline-flexible"
          label={this.props.intl.formatMessage({ id: 'terms_of_service_titel' })}
          style={textareaStyle}
          multiline
          value={this.state.multiline}
          disabled={this.state.disabled}
          onChange={this.handleChange('multiline')}
        />
        </div>
        <Button 
          compact color="primary"
          style={buttonStyle}
          onClick={() => {
                  this.setState({disabled: false});
              }}
          >
          {this.props.intl.formatMessage({ id: 'edit' })}
        </Button>
        <Button compact color="primary"
          onClick={() => {
                this.setState({ saveTosDialogOpen: true });
              }}>
          {this.props.intl.formatMessage({ id: 'save' })}
        </Button>
      </div>
    );
  }

  /**
   * Render the tos dialog description
   *
   * @return {Node}
   */
  renderConfirmationDesc = () =>
  <div>
      <DialogContentText>
          <strong>
              {this.props.intl.formatMessage({ id: 'terms_of_service_description' })}
          </strong>
      </DialogContentText>
  </div>;

  renderDialog () {
    return (
      <DialogWithButtons
      title={this.props.intl.formatMessage({ id: 'terms_of_service_titel' })}
      description={this.renderConfirmationDesc()}
      submitAction={this.props.intl.formatMessage({ id: 'ok' })}
      cancelAction={this.props.intl.formatMessage({ id: 'cancel' })}
      isOpen={this.state.saveTosDialogOpen}
      submit={() => {
          this.props.createTos(this.state.multiline);
          this.setState({ saveTosDialogOpen: false });
          this.setState({ disabled: true });
      }}
      close={() => this.setState({ saveTosDialogOpen: false })}
      />
    );
  }

}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Tos));