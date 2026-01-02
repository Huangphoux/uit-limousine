import AssignmentRepository from "../../../infrastructure_layer/repository/assignment.repository.js";
import SubmissionRepository from "../../../infrastructure_layer/repository/submission.repository.js";
import prisma from "../../../lib/prisma.js";

const assignmentRepo = new AssignmentRepository();
const submissionRepo = new SubmissionRepository();

export const createAssignment = async (req, res) => {
  try {
    const authId = req.body.authId;
    const { courseId, title, description, dueDate, maxPoints } = req.body;

    if (!authId) {
      return res.status(401).jsend.fail("Unauthorized");
    }

    if (!courseId || !title) {
      return res.status(400).jsend.fail("courseId and title are required");
    }

    // verify instructor owns the course
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).jsend.fail("Course not found");
    if (course.instructorId !== authId) return res.status(403).jsend.fail("Not course instructor");

    const data = {
      courseId,
      title,
      description: description || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      maxPoints: maxPoints || 100,
    };

    const created = await assignmentRepo.create(data);

    return res.status(201).jsend.success({ id: created.id, ...created });
  } catch (error) {
    console.error("Create assignment error", error);
    return res.status(500).jsend.fail("Failed to create assignment");
  }
};

export const getAssignmentSubmissions = async (req, res) => {
  try {
    const assignmentId = req.params.id || req.params.assignmentId;
    if (!assignmentId) return res.status(400).jsend.fail("Assignment id required");

    const subs = await submissionRepo.findByAssignment(assignmentId);

    // map to DTO
    const dto = subs.map((s) => ({
      id: s.id,
      assignmentId: s.assignmentId,
      studentId: s.studentId,
      studentName: s.student?.name || s.studentName || null,
      studentEmail: s.student?.email || null,
      content: s.content,
      fileUrl: s.fileUrl,
      fileName: s.fileName,
      fileSize: s.fileSize,
      status: s.status,
      grade: s.grade,
      feedback: s.feedback,
      submittedAt: s.submittedAt,
    }));

    return res.status(200).jsend.success({ submissions: dto });
  } catch (error) {
    console.error("Get submissions error", error);
    return res.status(500).jsend.fail("Failed to get submissions");
  }
};
