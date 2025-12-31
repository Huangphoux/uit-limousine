import prisma from "../../lib/prisma.js"; // ← ĐỔI IMPORT
import { AssignmentMapper } from "../mapper/assignment.mapper.js";

export default class AssignmentRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findById(id) {
    const result = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    return result;
  }

  async create(data) {
    const result = await prisma.assignment.create({
      data,
    });
    return result;
  }
  async update(id, data) {
    const result = await prisma.assignment.update({
      where: { id },
      data,
    });
    return result;
  }

  async getById(id) {
    const raw = await this.prisma.assignment.findUnique({
      where: { id },
      select: AssignmentRepository.baseQuery,
    });

    return AssignmentMapper.toDomain(raw);
  }

  async save(entity) {
    let raw = null;
    if (!entity)
      return raw;

    const persistence = AssignmentMapper.toPersistence(entity)
    if (!entity.id) {
      raw = this.prisma.assignment.create({
        data: persistence
      });
    }
    else {
      raw = this.prisma.assignment.update({
        where: { id: entity.id },
        data: persistence
      });
    }

    return AssignmentMapper.toDomain(await raw);
  }

  static baseQuery = {
    id: true,
    courseId: true,
    title: true,
    description: true,
    dueDate: true,
    maxPoints: true,
    createdAt: true
  }
}
