import prisma from '../src/lib/prisma.js';

// Ensure default roles exist before any test files run.
beforeAll(async () => {
  try {
    const count = await prisma.role.count();
    if (count === 0) {
      await prisma.role.createMany({
        data: [
          { name: 'ADMIN', desc: 'Administrator' },
          { name: 'INSTRUCTOR', desc: 'Course instructor' },
          { name: 'LEARNER', desc: 'Regular learner' },
        ],
      });
    }
  } catch (e) {
    // ignore
  }
});
