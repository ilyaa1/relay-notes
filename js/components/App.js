import React from 'react';
import Relay from 'react-relay';

import NoteListHeader from './NoteListHeader';
import NoteList from './NoteList';
import NoteTextInput from './NoteTextInput';

import AddNoteMutation from '../mutations/AddNoteMutation';

import styles from './App.scss';

const App = ({ viewer, relay }) => (
    <div className={styles.notesApp}>
        <NoteListHeader viewer={viewer} />
        <NoteList viewer={viewer} />
        <NoteTextInput
            placeholder='Enter new note...'
            onSave={(text) => {
                relay.commitUpdate(new AddNoteMutation({ text, viewer }));
            }}
        />
    </div>
);

export default Relay.createContainer(App, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                name,
                totalCount,
                notes(first: 2147483647) {
                    edges {
                        node { id, text, status, createdOn, updatedOn },
                    },
                },
                ${NoteListHeader.getFragment('viewer')},
                ${NoteList.getFragment('viewer')},
                ${AddNoteMutation.getFragment('viewer')},
            }
        `,
    },
});
