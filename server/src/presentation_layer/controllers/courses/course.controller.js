import { getAllCoursesUseCase, getCourseDetailUseCase } from '../../../application_layer/courses/course.usecase.js';

export const getAllCourses = async (req, res) => {
  try {
    const courses = await getAllCoursesUseCase();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await getCourseDetailUseCase(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};