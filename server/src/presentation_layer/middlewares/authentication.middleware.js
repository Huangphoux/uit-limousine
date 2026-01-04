import {
  verifyJwt,
  authenticationTokenSchema,
  bearerTokenHeaderSchema,
} from "../../utils/encrypt.js";

export function authenticationMiddleware(req, res, next) {
  try {
    console.log("Calling authentication");

    const result = authenticate(req.headers.authorization);
    // Initialize req.body if it doesn't exist (for GET requests)
    if (!req.body) {
      req.body = {};
    }
    req.body.authId = result.id;
    req.body.roles = result.roles;

    // Set req.user for controllers that expect it (e.g., NotificationController)
    req.user = {
      id: result.id,
      roles: result.roles,
    };

    next();

    console.log("Finish authentication");
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
