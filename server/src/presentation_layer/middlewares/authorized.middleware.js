export function roleAuthorizationMiddleware(roles) {
    return (req, res, next) => {
        try {
            console.log("Call role authorization middleware");

            authorize(roles, req.body.roles);

            next();

            console.log("Return role authorization middleware");
        }
        catch (e) {
            res.status(403).jsend.fail(e.message);
        }
    }
}

function authorize(requiredRoles, userRoles) {
    const req = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const user = Array.isArray(userRoles) ? userRoles : [userRoles];

    // Check if any user role is in required roles
    const hasRole = user.some(role => req.includes(role));

    if (!hasRole) {
        throw new Error("Forbidden: insufficient role");
    }

    console.log("Successfully authorized");
    return true;
}