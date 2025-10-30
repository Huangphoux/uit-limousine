import { CourseRepositoryPostgree } from '../infrastructure_layer/course.repository.postgree.js';
import { CourseEntity } from '../../domain_layer/course.entity.js';

export const getAllCoursesUseCase = async () => {
  const courses = await CourseRepositoryPostgree.getAllCourses();
  return courses.map(course => new CourseEntity(course));
};

export const getCourseDetailUseCase = async (courseId) => {
  const course = await CourseRepositoryPostgree.getCourseById(courseId);
  if (!course) return null;
  const totalStudents = course.enrollments.filter(e => e.status === 'ENROLLED').length;
  return new CourseEntity({ ...course, students: totalStudents });
};