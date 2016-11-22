import Relay, { Mutation } from 'react-relay';

export default class AddNoteMutation extends Mutation {
    static fragments = {
        viewer: () => Relay.QL`
            fragment on User {
                id,
                totalCount,
            }
        `,
    };
    
    getMutation() {
        return Relay.QL`mutation{addNote}`;
    }
    
    getFatQuery() {
        return Relay.QL`
            fragment on AddNotePayload @relay(pattern: true) {
                noteEdge,
                viewer {
                    notes,
                    totalCount,
                },
            }
        `;
    }
    
    getConfigs () {
        return [
            {
                type: 'RANGE_ADD',
                parentName: 'viewer',
                parentID: this.props.viewer.id,
                connectionName: 'notes',
                edgeName: 'noteEdge',
                rangeBehaviors: ({ status }) =>
                    status === 'deleted'
                        ? 'ignore'
                        : 'append',
            }
        ];
    }
    
    getVariables () {
        return {
            text: this.props.text,
        };
    }
    
    getOptimisticResponse () {
        return {
            noteEdge: {
                node: {
                    text: this.props.text,
                    createdOn: `${new Date().getTime()}`
                },
            },
            viewer: {
                id: this.props.viewer.id,
                totalCount: this.props.viewer.totalCount + 1,
            },
        };
    }
}
