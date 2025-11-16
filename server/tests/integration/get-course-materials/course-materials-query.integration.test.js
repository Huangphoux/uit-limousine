import request from "supertest";
import { prisma } from "../../../src/composition-root"
import app from "../../../src/app"
import { user, course, module, lessons } from "./course-materials-query.test-data";

jest.setTimeout(20000);

describe('Get courses material integration test', () => {
    let path;
    let input;
    let output;

    beforeAll(async () => {
        await prisma.course.create({ data: course });
        await prisma.module.create({ data: module });
        await prisma.lesson.createMany({ data: lessons });
    });

    afterAll(async () => {
        await prisma.course.delete({ where: { id: course.id } });
    });

    describe('Normal case', () => {
        beforeAll(async () => {
            path = `/courses/${course.id}/materials`;
            input = { userId: user.id };
            output = await request(app).get(path).send(input);
        });

        it(`Should return status 200`, () => {
            expect(output.status).toBe(200);
        });

        it(`Should return correct lesson 1`, () => {
            expect(output.body.data.modules[0].lessons[0]).toMatchObject({
                id: lessons[0].id,
                title: lessons[0].title,
                type: lessons[0].contentType,
                content: lessons[0].mediaUrl,
                duration: lessons[0].durationSec,
                order: lessons[0].position,
                isCompleted: false
            });
        });

        it(`Should return correct lesson 2`, () => {
            expect(output.body.data.modules[0].lessons[1]).toMatchObject({
                id: lessons[1].id,
                title: lessons[1].title,
                type: lessons[1].contentType,
                content: lessons[1].mediaUrl,
                duration: lessons[1].durationSec,
                order: lessons[1].position,
                isCompleted: false
            });
        });
    });

    describe('Abnormal case', () => {
        describe('Not found course case', () => {
            beforeAll(async () => {
                path = `/courses/dont-know/materials`;
                input = { userId: user.id };
                output = await request(app).get(path).send(input);
            });

            it(`Should return nothing`, () => {
                expect(output.body.data.modules).toHaveLength(0);
            });

        })
    })
});