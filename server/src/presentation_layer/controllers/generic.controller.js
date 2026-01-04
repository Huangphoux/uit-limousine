import { logger } from "../../utils/logger.js";

export function controller(usecase) {
  return async (req, res) => {
    try {
      logger.debug(`Calling ${usecase.constructor.name}`);

      let query = req.query || {};
      let params = req.params || {};
      let body = req.body || {};

      let input = {
        ...query,
        ...params,
        ...body,
        currentUserId: body.authId || null,
      };

      // Normalize common param names (e.g., :courseId) to `id` expected by usecases
      if (!input.id && params && params.courseId) {
        input.id = params.courseId;
      }

      const result = await usecase.execute(input);
      res.jsend.success(result);

      logger.debug(`Finish ${usecase.constructor.name}`);
    } catch (error) {
      res.status(400).jsend.fail(error.message);
      logger.error(error.message);
    }
  };
}
