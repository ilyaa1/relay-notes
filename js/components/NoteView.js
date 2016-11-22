import React, { Component, PropTypes } from 'react';
import Relay, { createContainer } from 'react-relay';
import moment from 'moment';
import styles from './NoteView.scss';

const formatDate = timeAsString =>
    moment(parseInt(timeAsString)).format('YYYY-MM-DD HH:mm');

const noteUpdated = ({ updatedOn, createdOn }) =>
    moment(parseInt(updatedOn)).isAfter(parseInt(createdOn));

const NoteView = ({ viewer, note, onEdit, onDelete }) => (
    <div className={styles.note}>
        <img src={viewer.avatarImageUrl} alt={viewer.name} />
        <div className={styles.noteContainer}>
            <div className={styles.noteContent}>
                <label>{note.text}</label>
                <div className={styles.noteCommands}>
                    <div className="edit" onClick={onEdit}>
                        <i className="fa fa-edit fa-lg" />
                    </div>
                    <div className="delete" onClick={onDelete}>
                        <i className="fa fa-times fa-lg" />
                    </div>
                </div>
            </div>
            <div className={styles.noteStatus}>
                <span>Created on: {formatDate(note.createdOn)}</span>
                {(noteUpdated(note)) && <span>Updated on: {formatDate(note.updatedOn)}</span>}
            </div>
        </div>
    </div>
);

NoteView.propTypes = {
    viewer: PropTypes.object.isRequired,
    note: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default createContainer(NoteView, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                name, 
                avatarImageUrl,
            }
        `,
        note: () => Relay.QL`
            fragment on Note {
                text,
                createdOn,
                updatedOn,
            }
        `
    }
});
