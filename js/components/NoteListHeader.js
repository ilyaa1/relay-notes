import React, { Component, PropTypes } from 'react';
import Relay, { createContainer } from 'react-relay';
import styles from './NoteListHeader.scss';

const NoteListHeader = ({ viewer }) => (
    <div className={styles.noteListHeader}>
        Total: {viewer.totalCount}
    </div>
);

NoteListHeader.propTypes = {
    viewer: PropTypes.object.isRequired,
};

export default createContainer(NoteListHeader, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                name,
                totalCount,
            },
        `
    }
});
