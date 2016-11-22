import Relay, { Mutation } from 'react-relay';

export default class UpdateNoteMutation extends Mutation {
    static fragments = {
        note: () => Relay.QL`
            fragment on Note {
                id,
            }
        `,
    };
    
    getMutation() {
        return Relay.QL`mutation{updateNote}`;
    }
    
    getFatQuery() {
        return Relay.QL`
            fragment on UpdateNotePayload @relay(pattern: true) {
                note {
                    text,
                    updatedOn,
                }
            }
        `;
    }
    
    getConfigs () {
        return [
            {
                type: 'FIELDS_CHANGE',
                fieldIDs: {
                    note: this.props.note.id,
                },
            }
        ];
    }
    
    getVariables () {
        return {
            id: this.props.note.id,
            text: this.props.text,
        };
    }
    
    getOptimisticResponse () {
        return {
            note: {
                id: this.props.note.id,
                text: this.props.text,
            },
        };
    }
}
