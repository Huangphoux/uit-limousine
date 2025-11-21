import z from "zod"

export const TitleSchema = z.string().nonempty("Title cannot be empty");
export const PriceSchema = z.number().nonnegative("Price must be >= 0")

export class CourseEntity {
    id;
    title;
    description;
    coverImg;
    instructorId;
    reviews;
    enrollments;
    price;
    createdAt;
    updatedAt;

    update_title(title) {
        this.title = TitleSchema.parse(title);
    }

    update_description(description) {
        this.description = description;
    }

    update_price(price) {
        this.price = PriceSchema.parse(price);
    }
}