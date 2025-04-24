import PropTypes from "prop-types";
import {useSelector} from "react-redux";

export default function Guarded({requiredRoles, children, deniedComponent, deniedAction}) {
    if (deniedAction && deniedComponent) {
        throw new Error("Guarded component cannot have both deniedComponent and deniedAction props");
    }
    const household = useSelector(state => state.household);
    const user = useSelector(state => {
        return state.user
    });
    const allowed = user.loginId && hasRoles(user, household, requiredRoles);
    if (allowed) {
        return children;
    } else {
        if (deniedComponent) {
            return deniedComponent;
        } else if (deniedAction) {
            deniedAction();
        }
        return null;

    }

}

function hasRoles(user, household, roles) {
    return roles.length === 0 || roles.some(role => {
        const tokens = `${role}:${household?.id}`.split(":");
        return user?.roles && user?.roles?.some(userRole => {
            const userRoleTokens = userRole.split(":");

            return userRoleTokens[0] === tokens[0] && (userRoleTokens[1] === tokens[1] || tokens[1] === "*");
        });
    });
}

Guarded.propTypes = {
    user: PropTypes.object,
    requiredRoles: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    deniedComponent: PropTypes.node,
    deniedAction: PropTypes.func
}