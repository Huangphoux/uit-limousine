import { logger } from "../../utils/logger.js";

export function controller(usecase) {
    return async (req, res) => {
        try {
            logger.debug(`Calling ${usecase.constructor.name}`);

            let input = {
                ...req.query,
                ...req.params,
                ...req.body
            }

            const result = await usecase.execute(input);
            res.jsend.success(result);

            logger.debug(`Finish ${usecase.constructor.name}`);
        }
        catch (error) {
            res.status(400).jsend.fail(error.message);
            logger.error(error.message);
        }
    }
}