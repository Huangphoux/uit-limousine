import { outputSchema } from "../../../src/application_layer/courses/course-materials-query.usecase";
import { courseMaterialsQueryUsecase, prisma } from "../../composition-root.js";
import { user, course, module, lessons, input } from "./test-data";

jest.setTimeout(20000);

describe('Get course materials integration test', () => {
    let test_input;
    let test_output;

    beforeAll(async () => {
        await prisma.user.create({ data: user });
        await prisma.course.create({ data: course });
        await prisma.module.create({ data: module });
        await prisma.lesson.createMany({ data: lessons });
        await prisma.enrollment.create({ 
            data: {
                userId: user.id,
                courseId: course.id,
                status: 'ENROLLED',
                isPaid: true
            } 
        });
    });

    afterAll(async () => {
        await prisma.enrollment.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
        await prisma.course.delete({ where: { id: course.id } });
    });

    describe('Normal case', () => {
        beforeAll(async () => {
            test_input = input;
            try {
                test_output = await courseMaterialsQueryUsecase.execute(test_input);
            }
            catch (e) {
                test_output = e;
            }
            console.log(test_output);
        });

        it(`Should return object match the schema`, () => {
            expect(() => outputSchema.parse(test_output)).not.toThrow();
        });

        it(`Should return 2 lessons`, () => {
            expect(test_output.modules[0].lessons).toHaveLength(2);
        });
    });
});