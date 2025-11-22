import { changeRoleUsecase } from "../../../composition-root.js";

export async function changeRoleController(req, res) {
    try {
        let input = {
            ...req.params,
            ...req.body,
        };

        const result = await changeRoleUsecase.execute(input);
        res.jsend.success(result);
    }
    catch (error) {
        res.status(400);
        res.jsend.fail(error.message);
    }
}