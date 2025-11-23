import { completeLessonUseCase, prisma } from "../../../src/composition-root"
import { course, module, lesson, lessonProgress, user } from "./complete-lesson.test-data";

jest.setTimeout(20000);

describe('Complete lesson integration test', () => {
    let test_input;
    let test_output;

    beforeAll(async () => {
        await prisma.user.create({ data: user });
        await prisma.course.create({ data: course });
        await prisma.module.create({ data: module });
        await prisma.lesson.create({ data: lesson });
        await prisma.lessonProgress.create({ data: lessonProgress });
    })

    afterAll(async () => {
        await prisma.user.delete({ where: { id: user.id } });
        await prisma.course.delete({ where: { id: course.id } });
    })

    describe('Normal case', () => {
        beforeAll(async () => {
            test_input = { userId: user.id };
            try {
                test_output = await completeLessonUseCase.execute(test_input);
            }
            catch (e) {
                test_output = e;
            }
        });

        it(`Should return correct lesson id`, () => {
            expect(test_output).toHaveProperty("lessonId", lesson.id);
        });

        it(`Should return completed-at time`, () => {
            expect(test_output).toHaveProperty("completedAt");
        });
    });

    describe('Abnormal case', () => {
        describe('Not found lesson case', () => {
            beforeAll(async () => {
                test_input = { userId: user.id };
                try {
                    test_output = await completeLessonUseCase.execute(test_input);
                }
                catch (e) {
                    test_output = e;
                }
            });

            it(`Should return error message`, () => {
                expect(test_output).toHaveProperty("message", "User has not learnt yet, dont-know");
            });

        })
    });
});