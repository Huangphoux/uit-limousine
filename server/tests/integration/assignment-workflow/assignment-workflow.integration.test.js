import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { prisma, modifyCourseUsecase } from "../../../src/composition-root.js";
import app from "../../../src/app.js";

describe("Assignment end-to-end workflow (modify -> submit -> grade)", () => {
  let instructor, student, course, moduleId, lessonId, assignmentId, submissionId;

  beforeAll(async () => {
    await prisma.$connect();

    instructor = await prisma.user.create({
      data: { email: `inst-${Date.now()}@test.com`, name: "Inst", username: `inst${Date.now()}` },
    });
    student = await prisma.user.create({
      data: { email: `stu-${Date.now()}@test.com`, name: "Student", username: `stu${Date.now()}` },
    });

    course = await prisma.course.create({
      data: {
        title: "Flow Test Course",
        level: "Beginner",
        price: 0,
        published: true,
        instructorId: instructor.id,
      },
    });

    // initial module and lesson (will be updated by modifyCourse)
    const mod = await prisma.module.create({
      data: { courseId: course.id, title: "Module 1", position: 0 },
    });
    moduleId = mod.id;
    const les = await prisma.lesson.create({
      data: { moduleId, title: "Placeholder", position: 0 },
    });
    lessonId = les.id;

    // enroll student
    await prisma.enrollment.create({
      data: { userId: student.id, courseId: course.id, status: "ENROLLED", isPaid: true },
    });
  }, 30000);

  afterAll(async () => {
    try {
      if (submissionId) await prisma.submission.delete({ where: { id: submissionId } });
      if (assignmentId) await prisma.assignment.delete({ where: { id: assignmentId } });
      // delete lesson and module and course
      await prisma.lesson.deleteMany({ where: { moduleId } });
      await prisma.module.deleteMany({ where: { courseId: course.id } });
      await prisma.enrollment.deleteMany({ where: { userId: student.id } });
      await prisma.course.delete({ where: { id: course.id } });
      await prisma.user.delete({ where: { id: instructor.id } });
      await prisma.user.delete({ where: { id: student.id } });
    } catch (e) {
      // ignore
    } finally {
      await prisma.$disconnect();
    }
  }, 30000);

  it("Modify course should create assignment and attach assignmentId to lesson", async () => {
    const input = {
      authId: instructor.id,
      id: course.id,
      title: "Flow Test Course Updated",
      price: 0,
      modules: [
        {
          id: moduleId,
          title: "Module 1",
          lessons: [
            {
              id: lessonId,
              title: "Homework 1",
              content: "Please complete tasks",
              contentType: "assignment",
              // include some assignment-like fields for creation
              dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
              maxPoints: 50,
            },
          ],
        },
      ],
    };

    const out = await modifyCourseUsecase.execute(input);
    expect(out).toHaveProperty("id", course.id);

    // reload lesson from DB
    const updatedLesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    expect(updatedLesson).toHaveProperty("assignmentId");
    assignmentId = updatedLesson.assignmentId;
    expect(assignmentId).toBeTruthy();

    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    expect(assignment).not.toBeNull();
  }, 30000);

  it("Student can submit to created assignment", async () => {
    expect(assignmentId).toBeTruthy();

    const res = await request(app)
      .post(`/courses/assignments/${assignmentId}/submit`)
      .send({ studentId: student.id, content: "My submission" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    submissionId = res.body.data.id || res.body.data.submissionId || res.body.data.id;
    expect(submissionId).toBeTruthy();
  }, 20000);

  it("Instructor can grade the submission", async () => {
    expect(submissionId).toBeTruthy();

    const res = await request(app)
      .post(`/grade/submissions/${submissionId}`)
      .send({ graderId: instructor.id, grade: 45, feedback: "Good job" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("grade", 45);
    expect(res.body.data).toHaveProperty("submissionId", submissionId);
  }, 20000);
});
