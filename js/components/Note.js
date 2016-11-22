import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';

import NoteView from './NoteView';
import NoteEditor from './NoteEditor';

import UpdateNoteMutation from '../mutations/UpdateNoteMutation';
import RemoveNoteMutation from '../mutations/RemoveNoteMutation';

import styles from './Note.scss';

class Note extends Component {
    static propTypes = {
        note: PropTypes.object.isRequired,
        viewer: PropTypes.object.isRequired
    };
    
    state = {
        isEditing: false
    };
    
    setEditingState = isEditing => {
        this.setState({ isEditing });
    };
    
    handleEditNote = () => {
        this.setEditingState(true);
    };
    
    handleCancelEdit = () => {
        this.setEditingState(false);
    };
    
    handleSaveEditorChanges = (text) => {
        const { relay, note } = this.props;
        
        this.setEditingState(false);
        
        relay.commitUpdate(
            new UpdateNoteMutation({ note, text })
        );
    };
    
    handleDeleteNote = () => {
        const { relay, note, viewer } = this.props;
        
        relay.commitUpdate(
            new RemoveNoteMutation({ note, viewer })
        );
    };
    
    render () {
        const { viewer, note } = this.props;
        const { isEditing: editing } = this.state;
        
        const className = classnames({ editing, [styles.note]: true });
        
        const currentView = editing
            ? <NoteEditor note={note}
                          initialValue={note.text}
                          onSave={this.handleSaveEditorChanges}
                          onCancel={this.handleCancelEdit}/>
            : <NoteView viewer={viewer}
                        note={note}
                        onEdit={this.handleEditNote}
                        onDelete={this.handleDeleteNote}/>;
        
        return (
            <li className={className}>
                {currentView}
            </li>
        );
    }
}

export default Relay.createContainer(Note, {
    fragments: {
        note: () => Relay.QL`
            fragment on Note {
                id,
                text,
                status,
                createdOn,
                updatedOn,
                ${NoteView.getFragment('note')},
                ${UpdateNoteMutation.getFragment('note')},
                ${RemoveNoteMutation.getFragment('note')},
            }
        `,
        viewer: () => Relay.QL`
            fragment on User {
                ${RemoveNoteMutation.getFragment('viewer')},
                ${NoteView.getFragment('viewer')},
            },
        `,
    },
});
