export class CourseEntity {
    #id;
    #title;
    #description;
    #coverImg;
    #instructor;
    #reviews;
    #enrollments;
    #price;
    #createdAt;

    get id() { return this.#id; }
    get title() { return this.#title; }
    get description() { return this.#description; }
    get coverImg() { return this.#coverImg; }
    get instructor() { return this.#instructor; }
    get reviews() { return this.#reviews; }
    get enrollments() { return this.#enrollments; }
    get price() { return this.#price; }
    get createdAt() { return this.#createdAt; }

    set id(value) { this.#id = value; }
    set title(value) { this.#title = value; }
    set description(value) { this.#description = value; }
    set coverImg(value) { this.#coverImg = value; }
    set instructor(value) { this.#instructor = value; }
    set reviews(value) { this.#reviews = value; }
    set enrollments(value) { this.#enrollments = value; }
    set price(value) { this.#price = value; }
    set createdAt(value) { this.#createdAt = value; }
}