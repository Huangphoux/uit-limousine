import { getUsersUsecase } from "../../../composition-root.js";

export async function getUsersController(req, res) {
    try {
        let input = {
            ...req.query,
            ...req.body,
        };

        const result = await getUsersUsecase.execute(input);
        res.jsend.success(result);
    }
    catch (error) {
        res.status(400);
        res.jsend.fail(error.message);
    }
}