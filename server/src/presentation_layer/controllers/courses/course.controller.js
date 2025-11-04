import prisma from '../../../../prisma/client.js';

export const getCourseById = async (req, res) => {
  const { id: courseId } = req.params; 

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        modules: {
          include: {
            lessons: {
              select: { id: true, title: true, contentType: true, position: true, durationSec: true }
            }
          }
        },
        enrollments: { select: { id: true, userId: true, status: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } }
          }
        }
      }
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });

    const totalStudents = course.enrollments.filter(e => e.status === 'ENROLLED').length;

    res.json({
      id: course.id,
      title: course.title,
      // slug: course.slug,
      shortDesc: course.shortDesc,
      description: course.description,
      language: course.language,
      level: course.level,
      price: course.price,
      published: course.published,
      publishDate: course.publishDate,
      coverImage: course.coverImage,
      instructor: course.instructor,
      modules: course.modules.map(mod => ({
        id: mod.id,
        title: mod.title,
        position: mod.position,
        lessons: mod.lessons
      })),
      students: totalStudents,
      reviews: course.reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        user: r.user
      })),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};