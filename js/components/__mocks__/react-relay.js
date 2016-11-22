var Relay = require.requireActual('react-relay');
var React = require('react');

export class Mutation extends Relay.Mutation {
    _resolveProps (props) {
        this.props = props;
    }
}

export class MockStore {
    reset () {
        this.successResponse = undefined;
    }
    
    succeedWith (response) {
        this.reset();
        this.successResponse = response;
    }
    
    failWith (response) {
        this.reset();
        this.failureResponse = response;
    }
    
    update (callbacks) {
        if (this.successResponse) {
            callbacks.onSuccess(this.successResponse);
        }
        else if (this.failureResponse) {
            callbacks.onFailure(this.failureResponse);
        }
        this.reset();
    }
    
    commitUpdate (mutation, callbacks) {
        return this.update(callbacks);
    }
    
    applyUpdate (mutation, callbacks) {
        return this.update(callbacks);
    }
}

export const Store = new MockStore();
export const Route = Relay.Route;
export const PropTypes = Relay.PropTypes;

module.exports = {
    QL: Relay.QL,
    // Mutation: Relay.Mutation,
    Mutation,
    Route,
    // Store: { update: jest.genMockFn() },
    Store,
    createContainer: (component, containerSpec) => {
        const fragments = containerSpec.fragments || {};
        
        Object.assign(component, {
            getFragment: (fragmentName) => fragments[fragmentName],
            getRelaySpecs: () => containerSpec
        });
                
        return component;
    }
};
