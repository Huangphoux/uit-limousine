import request from "supertest";
import { prisma } from "../../../src/composition-root"
import { course, student, studentRole } from "./enroll-courses.test-data"
import app from "../../../src/app"

describe('Enroll courses integration test', () => {
    let path;
    let input;
    let output;

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
            path = `/courses/${course.id}/enroll`;
            input = { userId: student.id };
            output = await request(app).post(path).send(input);
        });

        afterAll(async () => {
            await prisma.enrollment.deleteMany({ where: { userId: student.id } });
        });

        it(`Should return status 200`, () => {
            expect(output.status).toBe(200);
        });

        it(`Should return enrollment id`, () => {
            expect(output.body.data).toHaveProperty("enrollmentId");
        })

        it(`Should return correct course id`, () => {
            expect(output.body.data).toHaveProperty("courseId", course.id);
        })

        it(`Should return correct student id`, () => {
            expect(output.body.data).toHaveProperty("studentId", student.id);
        })

        it(`Should return enrolled at`, () => {
            expect(output.body.data).toHaveProperty("enrolledAt");
        })

        it(`Should return status ENROLLED`, () => {
            expect(output.body.data).toHaveProperty("status", "ENROLLED");
        })
    });

    describe('Abnormal case', () => {
        describe("Course not found", () => {
            beforeAll(async () => {
                path = `/courses/dont-know/enroll`;
                input = { userId: student.id };
                output = await request(app).post(path).send(input);
            })

            it(`Should return error message`, () => {
                expect(output.body).toHaveProperty("message", "Course not found, dont-know");
            })
        })
    })
});