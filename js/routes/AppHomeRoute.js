import Relay from 'react-relay';

export default class extends Relay.Route {
    static queries = {
        viewer: (Component, vars) => Relay.QL`
            query {
                viewer {
                    ${Component.getFragment('viewer', vars)}
                }
            }
        `,
    };
    
    static routeName = 'AppHomeRoute';
}
