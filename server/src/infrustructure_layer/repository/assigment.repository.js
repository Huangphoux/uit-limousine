export class AssignmentRepository {
    #assignmentModel;
    constructor(assignmentModel) {
        this.#assignmentModel = assignmentModel;
    }

    async findById(id) {
        return this.#assignmentModel.findUnique({
            where: { id },
        });
    }
}
