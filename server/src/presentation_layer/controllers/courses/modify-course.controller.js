import { modifyCourseUsecase } from "../../../composition-root.js";

export async function modifyCourse(req, res) {
    try {
        console.log(`Call PUT /courses/${req.params.courseId}`);

        let input = {
            id: req.params.courseId,
            ...req.body,
        }

        const result = await modifyCourseUsecase.execute(input);
        res.jsend.success(result);

        console.log(`.Return PUT /courses/${req.params.courseId}`)
    }
    catch (error) {
        console.error(error.message);
        res.status(400);
        res.jsend.fail(error.message);
    }
}