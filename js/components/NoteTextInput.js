import React, { Component, PropTypes } from 'react';
import { KEY_CODES } from '../constants';

export default class NoteTextInput extends Component {
    static propTypes = {
        className: PropTypes.string,
        initialValue: PropTypes.string,
        onCancel: PropTypes.func,
        onSave: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
    };
    
    state = {
        text: '',
        editing: false
    };
    
    cancelEdit = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
        else {
            this.setState({
                text: '',
                editing: false
            });
        }
    };
    
    commitChanges = () => {
        const newText = this.state.text.trim();
        
        if (newText === this.props.initialValue) {
            this.cancelEdit();
        }
        else if (newText !== '') {
            this.props.onSave(newText);
            this.setState({ text: '' });
        }
    };
    
    handleChange = event => {
        this.setState({ text: event.target.value });
    };
    
    handleKeyDown = event => {
        if (event.keyCode === KEY_CODES.ESC) {
            this.cancelEdit();
        }
        else if (event.keyCode === KEY_CODES.ENTER) {
            this.commitChanges();
        }
    };
    
    render () {
        const { className, placeholder } = this.props;
        
        return (
            <input
                className={className}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                placeholder={placeholder}
                value={this.state.text}
            />
        );
    }
}
