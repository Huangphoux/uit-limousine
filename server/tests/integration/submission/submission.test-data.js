// tests/integration/submission/submission.test-data.js
export const instructor = {
  email: 'instructor-test@example.com',
  name: 'Instructor Test',
};

export const student = {
  email: 'student-test@example.com',
  name: 'Student Test',
};

export const otherStudent = {
  email: 'otherstudent-test@example.com',
  name: 'Other Student',
};

export const courseTemplate = {
  title: "Intro to Testing (integration)",
  category: "Testing",
  shortDesc: "Course for testing submission API",
  description: "Course description for submission tests",
  language: "en",
  level: "Beginner",
  price: 0,
  published: true,
  coverImage: "https://cdn.example.com/thumbnails/course-test.jpg",
};

export const assignmentFutureTemplate = {
  title: "Assignment Future",
  description: "Due in the future",
  dueOffsetMs: 24 * 60 * 60 * 1000 // +1 day
};

export const assignmentPastTemplate = {
  title: "Assignment Past",
  description: "Already due",
  dueOffsetMs: -24 * 60 * 60 * 1000 // -1 day
};
