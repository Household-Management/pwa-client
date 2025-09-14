import {Guard} from './Guarded';

const meta = {
    component: ({requiredRoles, userRoles, forbiddenRoles, showDenial}) =>
        (<Guard
            household={{id: "household-1"}}
            user={{loginId: "1", roles: userRoles}}
            requiredRoles={requiredRoles}
            deniedComponent={showDenial ? <div>Access Denied</div> : null}>
            Access Granted
        </Guard>)
}

export default meta;

export const GuardedComponent = {
    args: {
        requiredRoles: [
            "admin"
        ],
        userRoles: [
            "admin:household-1"
        ],
        showDenial: false
    }
}