import request from "supertest";
import { prisma } from "../../../src/composition-root"
import app from "../../../src/app"
import { course, module, lesson, lessonProgress, user } from "./complete-lesson.test-data";

jest.setTimeout(20000);

describe('Complete lesson integration test', () => {
    let path;
    let input;
    let output;

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
            path = `/lessons/${lesson.id}/complete`;
            input = { userId: user.id };
            output = await request(app).post(path).send(input);
        });

        it(`Should return status 200`, () => {
            expect(output.status).toBe(200);
        });

        it(`Should return correct lesson id`, () => {
            expect(output.body.data).toHaveProperty("lessonId", lesson.id);
        });

        it(`Should return completed-at time`, () => {
            expect(output.body.data).toHaveProperty("completedAt");
        });
    });

    describe('Normal case', () => {
        describe('Not found lesson case', () => {
            beforeAll(async () => {
                path = `/lessons/dont-know/complete`;
                input = { userId: user.id };
                output = await request(app).post(path).send(input);
            });

            it(`Should return error message`, () => {
                expect(output.body).toHaveProperty("message", "User has not learnt yet, dont-know");
            });

        })
    });
});