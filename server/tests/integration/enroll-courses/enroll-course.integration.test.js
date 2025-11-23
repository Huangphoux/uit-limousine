import { enrollCoursesUseCase as enrollCourseUseCase, prisma } from "../../../src/composition-root"
import { course, student, input } from "./test-data"
import { z } from "zod";

jest.setTimeout(20000);

export const enrollmentSchema = z.object({
    enrollmentId: z.string(),
    courseId: z.literal(course.id),
    studentId: z.literal(student.id),
    enrolledAt: z.date(),
    status: z.literal("ENROLLED"),
});


describe('Enroll course integration test', () => {
    let test_input = input;
    let test_output;

    beforeAll(async () => {
        await prisma.user.create({ data: student });
        await prisma.course.create({ data: course });
    });

    afterAll(async () => {
        await prisma.course.delete({ where: { id: course.id } });
        await prisma.user.delete({ where: { id: student.id } });
    });

    describe('Normal case', () => {
        beforeAll(async () => {
            try {
                test_output = await enrollCourseUseCase.execute(test_input);
            }
            catch (e) {
                test_output = e;
            }
            console.log(test_output);
        });

        afterAll(async () => {
            await prisma.enrollment.deleteMany({ where: { userId: student.id } });
        });

        it(`Should return object match the schema`, () => {
            expect(() => enrollmentSchema.parse(test_output)).not.toThrow();
        });
    });

    describe('Abnormal case', () => {
        describe("Course not found", () => {
            beforeAll(async () => {
                test_input = structuredClone(input);
                test_input.courseId = "unknown";

                try {
                    test_output = await enrollCourseUseCase.execute(test_input);
                }
                catch (e) {
                    test_output = e;
                }
            });

            it(`Should return error message`, () => {
                expect(test_output).toHaveProperty("message", `Course not found, ${test_input.courseId}`);
            });
        });
    });
});