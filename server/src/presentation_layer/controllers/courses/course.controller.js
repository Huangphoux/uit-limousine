import prisma from "../../../../prisma/client.js";

export const getCourseById = async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        modules: {
          orderBy: { position: "asc" }, // Nên sắp xếp module theo vị trí
          include: {
            lessons: {
              orderBy: { position: "asc" }, // Nên sắp xếp lesson theo vị trí
              select: {
                id: true,
                title: true,
                contentType: true,
                position: true,
                durationSec: true,
                // --- BƯỚC 1: Lấy thêm thông tin assignment ---
                assignment: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    dueDate: true,
                    maxPoints: true,
                  },
                },
                LessonProgress: {
                  where: { userId: req.body.authId }, // Lấy tiến độ của user hiện tại
                },
              },
            },
          },
        },
        enrollments: { select: { id: true, userId: true, status: true, isPaid: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!course) return res.status(404).json({ error: "Course not found" });

    const totalStudents = course.enrollments.filter((e) => e.status === "ENROLLED").length;

    // Determine whether the current user (if any) is enrolled and has paid
    const currentUserId = req.body.authId || null;
    const myEnrollment = currentUserId
      ? course.enrollments.find((e) => e.userId === currentUserId)
      : null;
    const isEnrolledByCurrentUser = myEnrollment ? myEnrollment.status === "ENROLLED" : false;

    // If user has no enrollment yet, still consider whether they made a successful payment
    let isPaidByCurrentUser = myEnrollment ? Boolean(myEnrollment.isPaid) : false;
    if (!myEnrollment && currentUserId) {
      const payment = await prisma.payment.findFirst({
        where: { userId: currentUserId, courseId: courseId, status: "SUCCESS" },
      });
      if (payment) {
        isPaidByCurrentUser = true;
        console.log(
          `[getCourseById] Found SUCCESS payment for user=${currentUserId} course=${courseId} paymentId=${payment.id}`
        );
      } else {
        console.log(
          `[getCourseById] No SUCCESS payment for user=${currentUserId} course=${courseId}`
        );
      }
    }

    // Debug log to ensure metadata returned
    console.log(
      "[getCourseById] course id:",
      course.id,
      "category:",
      course.category,
      "duration:",
      course.durationWeeks,
      course.durationDays,
      course.durationHours,
      "organization:",
      course.organization,
      "requirement:",
      course.requirement,
      "coverImage:",
      course.coverImage,
      "isEnrolledByCurrentUser:",
      isEnrolledByCurrentUser,
      "isPaidByCurrentUser:",
      isPaidByCurrentUser
    );

    // Calculate total duration from lessons if explicit duration fields are not set
    let calculatedDurationHours = null;
    if (!course.durationWeeks && !course.durationDays && !course.durationHours) {
      const totalSec = (course.modules || []).reduce((sum, module) => {
        return sum + (module.lessons || []).reduce((lessonSum, lesson) => {
          return lessonSum + (lesson.durationSec || 0);
        }, 0);
      }, 0);
      
      if (totalSec > 0) {
        calculatedDurationHours = Math.round((totalSec / 3600) * 10) / 10; // Round to 1 decimal
      }
    }

    res.json({
      id: course.id,
      title: course.title,
      shortDesc: course.shortDesc,
      description: course.description,
      language: course.language,
      level: course.level,
      price: course.price,
      published: course.published,
      publishDate: course.publishDate,
      coverImage: course.coverImage,
      category: course.category || null,
      durationWeeks: course.durationWeeks || null,
      durationDays: course.durationDays || null,
      durationHours: course.durationHours || calculatedDurationHours || null,
      organization: course.organization || null,
      requirement: course.requirement || null,
      instructor: course.instructor,
      // --- BƯỚC 2: Map dữ liệu để trả về ---
      modules: course.modules.map((mod) => ({
        id: mod.id,
        title: mod.title,
        position: mod.position,
        lessons: mod.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          contentType: lesson.contentType,
          position: lesson.position,
          durationSec: lesson.durationSec,
          // Nếu lesson này là assignment, thông tin sẽ nằm ở đây, ngược lại là null
          assignment: lesson.assignment,
          isCompleted: lesson.LessonProgress.length > 0 && lesson.LessonProgress[0].progress >= 1.0,
        })),
      })),
      students: totalStudents,
      isEnrolled: isEnrolledByCurrentUser,
      isPaid: isPaidByCurrentUser,
      reviews: course.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        user: r.user,
      })),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllCoursesForAdmin = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        enrollments: {
          select: { status: true },
        },
        reviews: {
          select: { rating: true },
        },
        modules: {
          orderBy: { position: "asc" },
          include: {
            lessons: {
              orderBy: { position: "asc" },
              include: {
                assignment: {
                  select: {
                    id: true,
                    title: true,
                    maxPoints: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedCourses = courses.map((course) => {
      // Tính toán các thông số thống kê
      const totalEnrolled = course.enrollments.filter((e) => e.status === "ENROLLED").length;
      const totalPending = course.enrollments.filter((e) => e.status === "PENDING").length;
      const avgRating =
        course.reviews.length > 0
          ? (course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length).toFixed(
              1
            )
          : 0;

      // Calculate total duration from lessons if explicit duration fields are not set
      let calculatedDurationHours = null;
      if (!course.durationWeeks && !course.durationDays && !course.durationHours) {
        const totalSec = (course.modules || []).reduce((sum, module) => {
          return sum + (module.lessons || []).reduce((lessonSum, lesson) => {
            return lessonSum + (lesson.durationSec || 0);
          }, 0);
        }, 0);
        
        if (totalSec > 0) {
          calculatedDurationHours = Math.round((totalSec / 3600) * 10) / 10; // Round to 1 decimal
        }
      }

      return {
        id: course.id,
        title: course.title,
        price: course.price,
        published: course.published,
        category: course.category,
        coverImage: course.coverImage,
        instructor: course.instructor,
        createdAt: course.createdAt,
        durationWeeks: course.durationWeeks || null,
        durationDays: course.durationDays || null,
        durationHours: course.durationHours || calculatedDurationHours || null,

        // Thống kê tổng quan
        stats: {
          totalStudents: totalEnrolled,
          pendingStudents: totalPending,
          averageRating: parseFloat(avgRating),
        },

        // TRẢ VỀ CỤ THỂ CẤU TRÚC MODULES & LESSONS
        modules: course.modules.map((mod) => ({
          id: mod.id,
          title: mod.title,
          position: mod.position,
          lessonsCount: mod.lessons.length,
          lessons: mod.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            contentType: lesson.contentType, // video, article, v.v.
            position: lesson.position,
            durationSec: lesson.durationSec,
            // Nếu có assignment thì trả về object, không thì null
            assignment: lesson.assignment,
          })),
        })),
      };
    });

    res.json({
      status: "success",
      results: formattedCourses.length,
      data: {
        courses: formattedCourses,
      },
    });
  } catch (err) {
    console.error("Admin Get All Courses Error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
