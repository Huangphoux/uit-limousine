import { logger } from "../../utils/logger.js";

export function registerController(registerUseCase) {
  return async (req, res) => {
    try {
      logger.debug(`Calling ${registerUseCase.constructor.name}`);

      const input = {
        email: req.body.email,
        password: req.body.password,
        fullName: req.body.fullName,
      };

      const result = await registerUseCase.execute(input);

      // Return response according to API design specification
      res.status(201).json({
        success: true,
        data: {
          id: result.id,
          email: result.email,
          fullName: result.fullName,
          role: result.role,
          emailVerified: result.emailVerified,
          createdAt: result.createdAt,
        },
        message: "Registration successful. Please check your email to verify your account.",
      });

      logger.debug(`Finish ${registerUseCase.constructor.name}`);
    } catch (error) {
      logger.error(error.message);

      // Return error response according to API design specification
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      });
    }
  };
}

export function loginController(loginUseCase) {
  return async (req, res) => {
    try {
      logger.debug(`Calling ${loginUseCase.constructor.name}`);

      const input = {
        email: req.body.email,
        password: req.body.password,
      };

      const result = await loginUseCase.execute(input);

      // Return response according to API design specification
      res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.accessToken, // Use same token as refresh for now
          user: {
            id: result.user.id,
            email: result.user.email,
            fullName: result.user.fullname,
            role: result.user.role[0] || "LEARNER", // Take first role or default
          },
        },
      });

      logger.debug(`Finish ${loginUseCase.constructor.name}`);
    } catch (error) {
      logger.error(error.message);

      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      });
    }
  };
}

export function logoutController() {
  return async (req, res) => {
    try {
      logger.debug("Logout controller called");

      // In a full implementation, you might:
      // 1. Blacklist the JWT token
      // 2. Clear server-side sessions
      // 3. Log the logout event
      // For now, we'll just return success response

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });

      logger.debug("Logout completed successfully");
    } catch (error) {
      logger.error(error.message);

      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Logout failed",
          timestamp: new Date().toISOString(),
        },
      });
    }
  };
}
