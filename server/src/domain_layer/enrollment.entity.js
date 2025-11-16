export class EnrollmentEntity {
    #id;
    #userId;
    #courseId;
    #status;
    #enrolledAt;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get userId() {
        return this.#userId;
    }
    set userId(value) {
        this.#userId = value;
    }

    get courseId() {
        return this.#courseId;
    }
    set courseId(value) {
        this.#courseId = value;
    }

    get status() {
        return this.#status;
    }
    set status(value) {
        this.#status = value;
    }

    get enrolledAt() {
        return this.#enrolledAt;
    }
    set enrolledAt(value) {
        this.#enrolledAt = value;
    }

    static create(userId, courseId) {
        let enrollment = new EnrollmentEntity();
        enrollment.userId = userId;
        enrollment.courseId = courseId;
        enrollment.status = "ENROLLED";
        enrollment.enrolledAt = new Date();

        return enrollment;
    }
}
