import Guarded from './Guarded';

const meta = {
    component: ({ requiredRoles, userRoles, forbiddenRoles, showDenial }) =>
        (<Guarded requiredRoles={requiredRoles}
                  user={{roles: userRoles}}
                  deniedComponent={showDenial ? <div>Access Denied</div> : null}>
        Access Granted
    </Guarded>)
}

export default meta;

export const GuardedComponent = {
    args: {
        requiredRoles: [
            "admin"
        ],
        userRoles: [
            "admin"
        ],
        showDenial: false
    }
}