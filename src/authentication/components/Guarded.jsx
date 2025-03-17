export default function ({user, requiredRoles, children, deniedComponent}) {
    const allowed = user && hasRoles(user, requiredRoles);
    if(allowed) {
        return children;
    } else {
        if(deniedComponent) {
            return deniedComponent;
        } else {
            return null;
        }
    }

}

function hasRoles(user, roles) {
    return roles.some(role => user.roles.includes(role));
}