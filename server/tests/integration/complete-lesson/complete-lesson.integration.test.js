import { completeLessonUseCase, prisma } from "../../../src/composition-root"
import { course, module, lesson, lessonProgress, user, input, enrollment } from "./test-data";
import z from "zod";

jest.setTimeout(20000);

export const testCompleteLessonSchema = z.object({
    lessonId: z.literal(lesson.id),
    completedAt: z.date(),
    courseProgress: z.literal(100),
});

describe('Complete lesson integration test', () => {
    let test_input;
    let test_output;

    beforeAll(async () => {
        await prisma.user.create({ data: user });
        await prisma.course.create({ data: course });
        await prisma.module.create({ data: module });
        await prisma.lesson.create({ data: lesson });
        await prisma.enrollment.create({ data: enrollment });
    })

    afterAll(async () => {
        await prisma.enrollment.deleteMany({ where: { userId: user.id } });
        await prisma.lessonProgress.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
        await prisma.course.delete({ where: { id: course.id } });
    })

    describe('Normal case', () => {
        beforeAll(async () => {
            test_input = input;
            try {
                test_output = await completeLessonUseCase.execute(test_input);
            }
            catch (e) {
                test_output = e;
            }

            console.log(test_output);
        });

        it(`Should return object match the schema`, () => {
            expect(() => testCompleteLessonSchema.parse(test_output)).not.toThrow();
        });
    });

    describe('Abnormal case', () => {
        describe('Not found lesson case', () => {
            beforeAll(async () => {
                test_input = structuredClone(input);
                test_input.lessonId = "unknown";
                try {
                    test_output = await completeLessonUseCase.execute(test_input);
                }
                catch (e) {
                    test_output = e;
                }
            });

            it(`Should return error message`, () => {
                expect(test_output).toHaveProperty("message", "Course not found");
            });

        })
    });
});