import PropTypes from "prop-types";
import {useSelector} from "react-redux";

export default function Guarded({user, requiredRoles, children, deniedComponent, deniedAction}) {
    if (deniedAction && deniedComponent) {
        throw new Error("Guarded component cannot have both deniedComponent and deniedAction props");
    }
    const allowed = user && hasRoles(user, requiredRoles);
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

function hasRoles(user, roles) {
    return roles.length === 0 || roles.some(role => user.roles.includes(role));
}

Guarded.propTypes = {
    user: PropTypes.object,
    requiredRoles: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    deniedComponent: PropTypes.node,
    deniedAction: PropTypes.func
}