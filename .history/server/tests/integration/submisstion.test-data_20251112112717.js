import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createTestData() {
  try {
    // Tạo User
    const user = await prisma.user.upsert({
      where: { email: 'test@student.com' },
      update: {},
      create: {
        email: 'test@student.com',
        name: 'Test Student',
        username: 'teststudent123'
      }
    });
    console.log('✅ User ID:', user.id);

    // Tạo Course
    const course = await prisma.course.upsert({
      where: { id: user.id }, // hack to check existence
      update: {},
      create: {
        title: 'Test Course - English',
        level: 'Beginner',
        published: true
      }
    }).catch(() => 
      prisma.course.create({
        data: {
          title: 'Test Course - English',
          level: 'Beginner',
          published: true
        }
      })
    );
    console.log('✅ Course ID:', course.id);

    // Tạo Assignment
    const assignment = await prisma.assignment.create({
      data: {
        courseId: course.id,
        title: 'Homework 1',
        dueDate: new Date('2025-12-31'),
        maxPoints: 100
      }
    });
    console.log('✅ Assignment ID:', assignment.id);

    // Tạo Enrollment
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        courseId: course.id,
        status: 'ENROLLED',
        isPaid: true
      }
    });
    console.log('✅ Enrollment created');

    console.log('\n📋 COPY THESE VALUES FOR POSTMAN:');
    console.log('Student ID:', user.id);
    console.log('Assignment ID:', assignment.id);
    console.log('\n🔗 POSTMAN URL:');
    console.log(`http://localhost:3000/courses/assignments/${assignment.id}/submit`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();