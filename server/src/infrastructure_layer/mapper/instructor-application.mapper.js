export default class InstructorApplicationMapper {
  static toDTO(entity, application) {
    const dto = {
      id: entity.id,
      applicant: application?.applicant
        ? {
            id: application.applicant.id,
            name: application.applicant.name,
            email: application.applicant.email,
            avatarUrl: application.applicant.avatarUrl,
          }
        : null,
      requestedCourse: {
        title: entity.requestedCourseTitle,
        summary: entity.requestedCourseSummary,
      },
      portfolioUrl: entity.portfolioUrl,
      coverImage: entity.coverImage || null,
      category: entity.category || null,
      level: entity.level || null,
      durationWeeks: entity.durationWeeks || null,
      durationDays: entity.durationDays || null,
      durationHours: entity.durationHours || null,
      organization: entity.organization || null,
      language: entity.language || null,
      requirement: entity.requirement || null,
      price: entity.price || null,
      status: entity.status,
      note: entity.note,
      appliedAt: entity.appliedAt,
      reviewedAt: entity.reviewedAt,
      reviewer: application?.reviewer
        ? {
            id: application.reviewer.id,
            name: application.reviewer.name,
            email: application.reviewer.email,
          }
        : null,
    };

    console.log("[InstructorAppMapper] DTO created:", {
      id: dto.id,
      status: dto.status,
      applicantName: dto.applicant?.name,
    });

    return dto;
  }

  static toListDTO(applications) {
    return applications.map((app) => ({
      id: app.id,
      applicant: {
        id: app.applicant?.id,
        name: app.applicant?.name,
        email: app.applicant?.email,
      },
      requestedCourseTitle: app.requestedCourseTitle,
      requestedCourseSummary: app.requestedCourseSummary,
      portfolioUrl: app.portfolioUrl || null,
      coverImage: app.coverImage || null,
      category: app.category || null,
      level: app.level || null,
      durationWeeks: app.durationWeeks || null,
      durationDays: app.durationDays || null,
      durationHours: app.durationHours || null,
      organization: app.organization || null,
      language: app.language || null,
      requirement: app.requirement || null,
      price: app.price || null,
      status: app.status,
      appliedAt: app.appliedAt,
      reviewedAt: app.reviewedAt,
    }));
  }
}
