import React, { PropTypes } from 'react';
import Relay, { createContainer } from 'react-relay';

import styles from './NoteList.scss';

import Note from './Note';

export const NoteList = ({ viewer }) => (
    <ul className={styles.noteList}>
        {viewer.notes.edges.map(({ node }) => (
            <Note key={node.id} note={node} viewer={viewer}/>
        ))}
    </ul>
);

export default createContainer(NoteList, {
    initialVariables: {
        status: null
    },
    prepareVariables({ status }) {
        const nextStatus =
            status === 'active' || status === 'completed'
                ? status
                : 'any';

        return {
            status: nextStatus,
        };
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                notes(status: $status, first: 2147483647) {
                    edges {
                        node {
                            id,
                            ${Note.getFragment('note')}
                        }
                    }
                },
                totalCount,
                ${Note.getFragment('viewer')}
            }
        `,
    },
});
