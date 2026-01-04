import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { prisma, modifyCourseUsecase } from "../../composition-root.js";
import app from "../../../src/app.js";
import bcrypt from 'bcrypt';
describe("Assignment end-to-end workflow (modify -> submit -> grade)", () => {
  let instructorToken;
  let studentToken;
  let courseId;
  let moduleId;
  let lessonId;
  let assignmentId;
  let submissionId;
  let instructor;
  let student;

  beforeAll(async () => {
    // 0. Ensure roles exist
    await prisma.role.upsert({
      where: { name: "INSTRUCTOR" },
      update: {},
      create: { name: "INSTRUCTOR", desc: "Instructor" }
    });
    await prisma.role.upsert({
      where: { name: "STUDENT" },
      update: {},
      create: { name: "STUDENT", desc: "Student" }
    });

    // 1. Tạo instructor
    instructor = await prisma.user.create({
      data: {
        email: "instructor-workflow@test.com",
        password: await bcrypt.hash("instructor123", 10),
        name: "Test Instructor"
      }
    });

    await prisma.userRole.create({
      data: {
        user: { connect: { id: instructor.id } },
        role: { connect: { name: "INSTRUCTOR" } }
      }
    });

    // 2. Login instructor
    const instructorLoginRes = await request(app)
      .post('/auth/login')
      .send({
        email: "instructor-workflow@test.com",
        password: "instructor123"
      });

    instructorToken = instructorLoginRes.body.token
      || instructorLoginRes.body.data?.token
      || instructorLoginRes.body.accessToken
      || instructorLoginRes.body.data?.accessToken;

    console.log('Instructor token:', instructorToken);

    // 3. Tạo course
    const course = await prisma.course.create({
      data: {
        title: "Flow Test Course",
        language: "en",
        level: "BEGINNER",
        price: 0,
        published: false,
        instructorId: instructor.id
      }
    });
    courseId = course.id;

    // 4. Tạo module
    const moduleRes = await prisma.module.create({
      data: {
        title: "Module 1",
        courseId: courseId,
        position: 0
      }
    });

    moduleId = moduleRes.id;

    // 5. Tạo lesson
    const lessonRes = await prisma.lesson.create({
      data: {
        title: "Initial Lesson",
        content: "Initial content",
        contentType: "video",
        moduleId: moduleId,
        position: 0
      }
    });

    lessonId = lessonRes.id;

    // 6. Tạo assignment
    const assignment = await prisma.assignment.create({
      data: {
        title: "Homework 1",
        description: "Complete this assignment",
        courseId: courseId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    assignmentId = assignment.id;

    // 7. Tạo student
    student = await prisma.user.create({
      data: {
        email: "student-workflow@test.com",
        password: await bcrypt.hash("student123", 10),
        name: "Test Student"
      }
    });

    await prisma.userRole.create({
      data: {
        user: { connect: { id: student.id } },
        role: { connect: { name: "STUDENT" } }
      }
    });

    // 8. Login student
    const studentLoginRes = await request(app)
      .post('/auth/login')
      .send({
        email: "student-workflow@test.com",
        password: "student123"
      });

    studentToken = studentLoginRes.body.token
      || studentLoginRes.body.data?.token
      || studentLoginRes.body.accessToken
      || studentLoginRes.body.data?.accessToken;
    console.log('Student login response:', studentLoginRes.body);

    // 9. Enroll student vào course
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: courseId,
        enrolledAt: new Date(),
      }
    });

    // 10. Publish course
    await prisma.course.update({
      where: { id: courseId },
      data: { published: true }
    });
  });

  afterAll(async () => {
    // Cleanup
    if (assignmentId) await prisma.submission.deleteMany({ where: { assignmentId } });
    if (student?.id) await prisma.enrollment.deleteMany({ where: { userId: student.id } });
    if (moduleId) await prisma.lesson.deleteMany({ where: { moduleId } });
    if (moduleId) await prisma.module.deleteMany({ where: { id: moduleId } });
    if (assignmentId) await prisma.assignment.deleteMany({ where: { id: assignmentId } });
    if (courseId) await prisma.course.deleteMany({ where: { id: courseId } });

    const userIds = [];
    if (instructor?.id) userIds.push(instructor.id);
    if (student?.id) userIds.push(student.id);
    if (userIds.length > 0) {
      await prisma.userRole.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
  });

  it("Setup should create all necessary entities", async () => {
    // Kiểm tra instructor tồn tại
    expect(instructor).toBeTruthy();
    expect(instructor.id).toBeTruthy();
    expect(instructorToken).toBeTruthy();

    // Kiểm tra student tồn tại
    expect(student).toBeTruthy();
    expect(student.id).toBeTruthy();
    expect(studentToken).toBeTruthy();

    // Kiểm tra course tồn tại
    expect(courseId).toBeTruthy();
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });
    expect(course).toBeTruthy();
    expect(course.published).toBe(true);

    // Kiểm tra module và lesson tồn tại
    expect(moduleId).toBeTruthy();
    expect(lessonId).toBeTruthy();

    // Kiểm tra assignment tồn tại
    expect(assignmentId).toBeTruthy();
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });
    expect(assignment).toBeTruthy();
    expect(assignment.title).toBe("Homework 1");

    // Kiểm tra enrollment tồn tại
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: student.id,
        courseId: courseId
      }
    });
    expect(enrollment).toBeTruthy();
  });

  it("Modify course should create assignment and attach assignmentId to lesson", async () => {
    const res = await request(app)
      .put(`/courses/${courseId}`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        title: "Flow Test Course Updated",
        price: 0,
        modules: [
          {
            id: moduleId,
            title: "Module 1",
            lessons: [
              {
                id: lessonId,  // ← Giữ ID cũ để không tạo lesson mới
                title: "Homework 1",
                content: "Please complete tasks",
                contentType: "assignment",
                assignmentId: assignmentId
              }
            ]
          }
        ]
      });

    expect(res.status).toBe(200);

    // ✅ FIX: Query lại lesson từ module thay vì dùng lessonId cố định
    const updatedLesson = await prisma.lesson.findFirst({
      where: {
        moduleId: moduleId,
        title: "Homework 1"  // Tìm theo title
      }
    });

    expect(updatedLesson).not.toBeNull();
    expect(updatedLesson.assignmentId).toBe(assignmentId);

    // Cập nhật lessonId cho các test sau
    lessonId = updatedLesson.id;
  });

  it("Student can submit to created assignment", async () => {
    expect(assignmentId).toBeTruthy();
    expect(studentToken).toBeTruthy();

    console.log('Submitting with token:', studentToken);
    console.log('Assignment ID:', assignmentId);

    const res = await request(app)
      .post(`/courses/assignments/${assignmentId}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        content: "My submission",
        authId: student.id
      });

    console.log('Submit response:', res.status, res.body);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    submissionId = res.body.data.id || res.body.data.submissionId;
    expect(submissionId).toBeTruthy();
  });

  it("Instructor can grade the submission", async () => {
    if (!submissionId) {
      const submitRes = await request(app)
        .post(`/courses/assignments/${assignmentId}/submit`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          content: "My submission",
          authId: student.id
        });

      submissionId = submitRes.body.data?.id;
    }

    expect(submissionId).toBeTruthy();

    const res = await request(app)
      .post(`/grade/submissions/${submissionId}`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        graderId: instructor.id,  // ← Đổi từ instructorId sang graderId
        grade: 95,                // ← Đổi từ score sang grade
        feedback: "Great work!"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
