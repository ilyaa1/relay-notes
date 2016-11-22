import {
    GraphQLID,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLEnumType,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from 'graphql';

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
    cursorForObjectInConnection,
} from 'graphql-relay';

import {
    // Import methods that your schema can use to interact with your database
    User,
    Note,
    getNote,
    getNotes,
    getNotesByUserId,
    addNote,
    removeNote,
    updateNote,
    removeAllNotes,
    getUser,
    getViewer,
} from './database';

var { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
        var { type, id } = fromGlobalId(globalId);
        
        switch (type) {
            case 'User':
                return getUser(id);
            
            case 'Note':
                return getNote(id);
            
            default:
                return null;
        }
    },
    (obj) => {
        if (obj instanceof User) {
            return UserType;
        }
        
        if (obj instanceof Note) {
            return NoteType;
        }
        
        return null;
    }
);

const NoteStatusEnumType = new GraphQLEnumType({
    name: 'NoteStatus',
    description: '',
    values: {
        ACTIVE: {
            value: 'active',
            description: 'An active note'
        },
        DELETED: {
            value: 'deleted',
            description: 'Deleted note'
        },
    }
});

const NoteType = new GraphQLObjectType({
    name: 'Note',
    description: 'User note to self',
    fields: () => ({
        id: globalIdField('Note'),
        text: {
            type: GraphQLString,
            resolve: obj => obj.text
        },
        status: {
            type: GraphQLString,
            resolve: obj => obj.status
        },
        createdOn: {
            type: GraphQLString,
            resolve: obj => `${obj.createdTimeStamp}`
        },
        updatedOn: {
            type: GraphQLString,
            resolve: obj => `${obj.updatedTimeStamp}`
        }
    }),
    interfaces: [nodeInterface],
});

const {
    connectionType: NotesConnection,
    edgeType: NoteEdge
} = connectionDefinitions({
    name: 'Note',
    nodeType: NoteType
});

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'A person who uses our app',
    fields: () => ({
        id: globalIdField('User'),
        name: {
            type: GraphQLString,
            description: 'Name of the user',
            resolve: (obj) => obj.name
        },
        notes: {
            type: NotesConnection,
            description: 'A person\'s collection of notes',
            args: {
                status: {
                    type: GraphQLString,
                    defaultValue: 'any',
                },
                ...connectionArgs
            },
            resolve: (_, { status, ...args }) => connectionFromArray(getNotes(status), args),
        },
        totalCount: {
            type: GraphQLInt,
            resolve: () => getNotes().length
        },
        deletedCount: {
            type: GraphQLInt,
            resolve: () => getNotes(Note.STATUS.DELETED).length
        },
        avatarImageUrl: {
            type: GraphQLString,
            resolve: obj => obj.avatarImageUrl
        }
    }),
    interfaces: [nodeInterface],
});

const Root = new GraphQLObjectType({
    name: 'Root',
    fields: {
        viewer: {
            type: UserType,
            resolve: () => getViewer(),
        },
        node: nodeField,
    },
});

const AddNoteMutation = mutationWithClientMutationId({
    name: 'AddNote',
    inputFields: {
        text: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
        noteEdge: {
            type: NoteEdge,
            resolve: ({ localNoteId }) => {
                const note = getNote(localNoteId);
    
                return {
                    cursor: cursorForObjectInConnection(getNotes(), note),
                    node: note,
                };
            },
        },
        viewer: {
            type: UserType,
            resolve: () => getViewer(),
        },
    },
    mutateAndGetPayload: ({ text }) => {
        const localNoteId = addNote(text);
        return { localNoteId };
    },
});

const RemoveNoteMutation = mutationWithClientMutationId({
    name: 'RemoveNote',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        deletedNoteId: {
            type: GraphQLID,
            resolve: ({ id }) => id,
        },
        viewer: {
            type: UserType,
            resolve: () => getViewer(),
        },
    },
    mutateAndGetPayload: ({ id }) => {
        const localNoteId = fromGlobalId(id).id;
        removeNote(localNoteId);
        return { id };
    },
});

const UpdateNoteMutation = mutationWithClientMutationId({
    name: 'UpdateNote',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
        note: {
            type: NoteType,
            resolve: ({ localNoteId }) => getNote(localNoteId),
        },
    },
    mutateAndGetPayload: ({ id, text }) => {
        const localNoteId = fromGlobalId(id).id;
        updateNote(localNoteId, text);
        return { localNoteId };
    },
});

const RemoveAllNotesMutation = mutationWithClientMutationId({
    name: 'RemoveAllNotes',
    inputFields: {},
    outputFields: {
        viewer: {
            type: UserType,
            resolve: () => getViewer(),
        },
    },
    mutateAndGetPayload: () => {
        removeAllNotes();
        return { id: -1 };
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addNote: AddNoteMutation,
        removeNote: RemoveNoteMutation,
        updateNote: UpdateNoteMutation,
        removeAllNotes: RemoveAllNotesMutation,
    })
});

export const Schema = new GraphQLSchema({
    query: Root,
    mutation: Mutation,
});
