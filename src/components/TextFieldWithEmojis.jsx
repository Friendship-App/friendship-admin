import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, Emoji } from 'emoji-mart';

class TextFieldWithEmojis extends Component {
  state = { visible: false };

  addEmoji = e => {
    let { value } = this.props;
    const event = { target: { value: `${value}${e.native}` } };
    this.props.onChange(event);
    this.hidePicker();
  };

  showPicker = () => {
    this.setState({ visible: true }, () => {
      this.refs.picker.focus();
    });
  };

  hidePicker = () => {
    this.setState({ visible: false });
  };

  pickerBlur = ({ relatedTarget }) => {
    // Do not hide picker if user focused search input
    if (!this.refs.picker.contains(relatedTarget)) {
      this.hidePicker();
    }
  };

  get picker() {
    if (!this.state.visible) {
      return null;
    }

    return (
      <div
        style={{ position: 'absolute', right: 0, zIndex: 1, outline: 'none' }}
        ref="picker"
        tabIndex="-1"
        onBlur={this.pickerBlur}
      >
        <Picker onSelect={this.addEmoji} title="select emoji" emoji="" />
      </div>
    );
  }

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <TextField {...this.props} />
        <div style={{ alignSelf: 'flex-end', position: 'relative' }}>
          <Emoji emoji="grinning" size={16} onClick={this.showPicker} />
          {this.picker}
        </div>
      </div>
    );
  }
}

export default TextFieldWithEmojis;
