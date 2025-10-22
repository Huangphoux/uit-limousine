// server/prisma/seed.js  (ESM)
// Chạy: node prisma/seed.js  (hoặc npx prisma db seed nếu cấu hình prisma.config.ts trỏ tới lệnh này)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAll() {
  // Xoá dữ liệu theo thứ tự con -> cha (tránh FK constraint)
  const tasks = [
    'auditLog',
    'certificate',
    'review',
    'submission',
    'assignment',
    'enrollment',
    'lesson',
    'module',
    'thread',
    'message',
    'notification',
    'payment',
    'token',
    'instructorApplication',
    'userRole',
    'role',
    'fileMeta',
    'course',
    'user',
  ];

  for (const t of tasks) {
    try {
      switch (t) {
        case 'auditLog': await prisma.auditLog.deleteMany(); break;
        case 'certificate': await prisma.certificate.deleteMany(); break;
        case 'review': await prisma.review.deleteMany(); break;
        case 'submission': await prisma.submission.deleteMany(); break;
        case 'assignment': await prisma.assignment.deleteMany(); break;
        case 'enrollment': await prisma.enrollment.deleteMany(); break;
        case 'lesson': await prisma.lesson.deleteMany(); break;
        case 'module': await prisma.module.deleteMany(); break;
        case 'thread': await prisma.thread.deleteMany(); break;
        case 'message': await prisma.message.deleteMany(); break;
        case 'notification': await prisma.notification.deleteMany(); break;
        case 'payment': await prisma.payment.deleteMany(); break;
        case 'token': await prisma.token.deleteMany(); break;
        case 'instructorApplication': await prisma.instructorApplication.deleteMany(); break;
        case 'userRole': await prisma.userRole.deleteMany(); break;
        case 'role': await prisma.role.deleteMany(); break;
        case 'fileMeta': await prisma.fileMeta.deleteMany(); break;
        case 'course': await prisma.course.deleteMany(); break;
        case 'user': await prisma.user.deleteMany(); break;
        default: break;
      }
    } catch (e) {
      // ignore, tiếp tục
      // console.warn('clear error', t, e.message);
    }
  }
}

async function main() {
  console.log('🌱 Prisma seed starting...');

  // Clear existing data (an toàn)
  console.log('🧹 Clearing tables...');
  await clearAll();
  console.log('🧹 Done clearing.');

  // 1) Roles
  console.log('1) Creating roles...');
  const [adminRole, instructorRole, learnerRole] = await Promise.all([
    prisma.role.create({ data: { name: 'ADMIN', desc: 'Administrator' } }),
    prisma.role.create({ data: { name: 'INSTRUCTOR', desc: 'Course instructor' } }),
    prisma.role.create({ data: { name: 'LEARNER', desc: 'Regular learner' } }),
  ]);

  // 2) Users
  console.log('2) Creating users...');
  const admin = await prisma.user.create({
    data: { email: 'admin@example.com', username: 'admin', name: 'Site Admin', password: 'admin-password', bio: 'System admin' },
  });

  const instructor = await prisma.user.create({
    data: { email: 'instructor@example.com', username: 'bob-instructor', name: 'Bob Instructor', password: 'instructor-pass', bio: 'Instructor' },
  });

  const applicant = await prisma.user.create({
    data: { email: 'applicant@example.com', username: 'alice-applicant', name: 'Alice Applicant', password: 'applicant-pass', bio: 'Wants to teach' },
  });

  const learner1 = await prisma.user.create({
    data: { email: 'learner1@example.com', username: 'learner1', name: 'Learner One', password: 'learner1-pass' },
  });

  const learner2 = await prisma.user.create({
    data: { email: 'learner2@example.com', username: 'learner2', name: 'Learner Two', password: 'learner2-pass' },
  });

  // 3) Assign roles (UserRole)
  console.log('3) Assigning user roles...');
  await prisma.userRole.createMany({
    data: [
      { userId: admin.id, roleId: adminRole.id },
      { userId: instructor.id, roleId: instructorRole.id },
      { userId: learner1.id, roleId: learnerRole.id },
      { userId: learner2.id, roleId: learnerRole.id },
    ],
    skipDuplicates: true,
  });

  // 4) Tokens
  console.log('4) Creating tokens...');
  await prisma.token.createMany({
    data: [
      { token: 'token-admin-123', userId: admin.id },
      { token: 'token-inst-123', userId: instructor.id },
    ],
    skipDuplicates: true,
  });

  // 5) InstructorApplication (applicant requests a course)
  console.log('5) Creating instructor application...');
  const instrApp = await prisma.instructorApplication.create({
    data: {
      applicantId: applicant.id,
      requestedCourseTitle: 'React cơ bản',
      requestedCourseSummary: 'Học React: component, hooks, state',
      portfolioUrl: 'https://example.com/portfolio/alice',
      status: 'PENDING',
      appliedAt: new Date(),
    },
  });

  // 6) Admin approves -> update app, create course and set instructorId = applicant.id
  console.log('6) Approving application and creating course...');
  const approvedApp = await prisma.instructorApplication.update({
    where: { id: instrApp.id },
    data: { status: 'APPROVED', reviewerId: admin.id, reviewedAt: new Date(), note: 'Approved for demo' },
  });

  const course = await prisma.course.create({
    data: {
      title: 'React cơ bản',
      slug: 'react-co-ban',
      shortDesc: 'Component, Hooks, State',
      description: 'Khoá học React cơ bản: components, props, state, hooks, routing',
      language: 'vi',
      level: 'Beginner',
      price: 0,
      published: true,
      publishDate: new Date(),
      coverImage: '/images/react-course.jpg',
      instructorId: applicant.id,
    },
  });

  // 7) Modules + Lessons
  console.log('7) Creating modules & lessons...');
  const mod1 = await prisma.module.create({
    data: {
      courseId: course.id,
      title: 'Module 1: Giới thiệu React',
      position: 0,
      lessons: {
        create: [
          { title: 'Lesson 1: Giới thiệu', content: 'Tổng quan React', contentType: 'article', position: 0 },
          { title: 'Lesson 2: Component & Props', content: 'Components và props', contentType: 'video', mediaUrl: 'https://example.com/v1.mp4', durationSec: 420, position: 1 },
        ],
      },
    },
    include: { lessons: true },
  });

  const mod2 = await prisma.module.create({
    data: {
      courseId: course.id,
      title: 'Module 2: Hooks cơ bản',
      position: 1,
      lessons: {
        create: [
          { title: 'Lesson 1: useState', content: 'Sử dụng useState', contentType: 'article', position: 0 },
          { title: 'Lesson 2: useEffect', content: 'Sử dụng useEffect', contentType: 'article', position: 1 },
        ],
      },
    },
    include: { lessons: true },
  });

  // 8) Enroll learners
  console.log('8) Creating enrollments...');
  await prisma.enrollment.createMany({
    data: [
      { userId: learner1.id, courseId: course.id, status: 'ENROLLED', isPaid: false },
      { userId: learner2.id, courseId: course.id, status: 'PENDING', isPaid: false },
    ],
    skipDuplicates: true,
  });

  // 9) Assignment + Submission
  console.log('9) Creating assignment & a submission...');
  const ass = await prisma.assignment.create({
    data: {
      courseId: course.id,
      title: 'Assignment 1: Todo App',
      description: 'Xây dựng todo app với React hooks',
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      maxPoints: 100,
    },
  });

  await prisma.submission.create({
    data: {
      assignmentId: ass.id,
      studentId: learner1.id,
      content: 'Link: https://github.com/learner1/todo',
      fileUrl: '',
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
  });

  // 10) Payment, Review, Certificate
  console.log('10) Creating payment, review and certificate...');
  await prisma.payment.create({
    data: {
      userId: learner1.id,
      courseId: course.id,
      amount: 0,
      currency: 'USD',
      provider: 'manual',
      providerTxnId: 'txn-demo-001',
      status: 'SUCCESS',
    },
  });

  await prisma.review.create({ data: { courseId: course.id, userId: learner1.id, rating: 5, comment: 'Great course!' } });

  await prisma.certificate.create({
    data: { userId: learner1.id, courseId: course.id, certificateUrl: 'https://certs.example.com/cert1', verificationCode: 'CERT-0001' },
  });

  // 11) Thread & Messages, Notification
  console.log('11) Creating thread/messages and notification...');
  const thread = await prisma.thread.create({
    data: {
      courseId: course.id,
      subject: 'Câu hỏi bài 2',
      messages: {
        create: [
          { senderId: learner1.id, content: 'Mình có câu hỏi về useEffect' },
          { senderId: applicant.id, content: 'Bạn chú ý dependencies array nhé' },
        ],
      },
    },
    include: { messages: true },
  });

  await prisma.notification.create({
    data: { userId: learner1.id, channel: 'IN_APP', title: 'Welcome', body: 'Chúc mừng bạn đã đăng ký khoá học', data: { courseId: course.id } },
  });

  // 12) AuditLog & FileMeta
  console.log('12) Creating audit log & file meta...');
  await prisma.auditLog.create({
    data: { actorId: admin.id, action: 'APPROVE_INSTRUCTOR_APPLICATION', resource: 'InstructorApplication', resourceId: approvedApp.id, data: { note: 'Demo approve' } },
  });

  await prisma.fileMeta.create({
    data: { url: '/uploads/sample.pdf', filename: 'sample.pdf', size: 12345, mimeType: 'application/pdf' },
  });

  console.log('✅ Seed finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
