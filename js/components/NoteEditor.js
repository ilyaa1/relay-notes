import React, { Component, PropTypes } from 'react';
import { KEY_CODES } from '../constants';
import classname from 'classnames';
import styles from './NoteEditor.scss';

export default class NoteEditor extends Component {
    static propTypes = {
        className: PropTypes.string,
        initialValue: PropTypes.string,
        onCancel: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
    };
    
    state = {
        text: this.props.initialValue,
        editing: false
    };
    
    cancelEdit = () => {
        this.props.onCancel();
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
        
        const containerClassName = classname([className, styles.noteEditor]);
        
        return (
            <div className={containerClassName}>
                <input
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    placeholder={placeholder}
                    value={this.state.text}
                />
                
                <div className="note-editor-commands">
                    <button onClick={this.commitChanges}>Save changes</button>
                    <button onClick={this.cancelEdit}>Cancel</button>
                </div>
            </div>
        );
    }
}
