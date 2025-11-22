import { verifyJwt, authenticationTokenSchema, bearerTokenHeaderSchema } from "../../utils/encrypt.js";

export function authenticationMiddleware(
    req,
    res,
    next
) {
    try {
        console.log("Call authentication middleware");

        const result = authenticate(req.headers.authorization);
        req.body.authId = result.id;
        req.body.roles = result.roles;

        next();

        console.log("Return authentication middleware");
    } catch (e) {
        console.error(e.message);
        res.status(401).jsend.fail(e.message);
    }
}

function authenticate(header) {
    const authHeader = bearerTokenHeaderSchema.parse(header);
    const splitted = authHeader.split(" ");
    const decoded = verifyJwt(splitted[1]);
    const result = authenticationTokenSchema.parse(decoded);
    return result;
}