export class LessonProgressEntity {
    #id;
    #userId;
    #lessonId;
    #progress;
    #completedAt;

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

    get lessonId() {
        return this.#lessonId;
    }
    set lessonId(value) {
        this.#lessonId = value;
    }

    get progress() {
        return this.#progress;
    }
    set progress(value) {
        if (value < 0 || value > 1.0)
            return;

        this.#progress = value;
    }

    get completedAt() {
        return this.#completedAt;
    }
    set completedAt(value) {
        this.#completedAt = value;
    }

    complete() {
        this.progress = 1.0;
        this.completedAt = new Date();
    }

    static create(id, userId, lessonId) {
        let entity = new LessonProgressEntity();
        entity.id = id;
        entity.userId = userId;
        entity.lessonId = lessonId;

        return entity;
    }
}
