import { CourseMapper } from "../mapper/course.mapper.js";
import { logger } from "../../utils/logger.js";
import { CourseEntity, courseSchema } from "../../domain_layer/course/course.entity.js";
import { buildQuery } from "../../utils/query-builder.js";
import { rehydrate, toPersistence } from "../../domain_layer/domain_service/factory.js";

export class CourseRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async findById(id) {
        const raw = await this.prisma.course.findUnique({
            where: { id: id },
            select: CourseRepository.baseQuery,
        });

        return CourseEntity.rehydrate(raw);
    }

    async findByFilter({ title, category, level, skip, take }) {
        const result = await this.prisma.course.findMany({
            where: {
                title: title,
                category: category,
                level: level,
            },
            skip,
            take,
            include: { instructor: true },
        });

        return result.map(CourseEntity.rehydrate);
    }

    async save(course) {
        const raw = await this.prisma.course.update({
            where: { id: course.id },
            data: toPersistence(course),
        })

        return CourseEntity.rehydrate(raw);
    }

    async add(course) {
        const persistenceData = toPersistence(course);

        logger.debug("Creating course in DB", {
            courseId: course.id,
            instructorId: course.instructorId,
            payload: persistenceData,
        });

        try {
            const raw = await this.prisma.course.create({ data: persistenceData });

            logger.info("Course created", {
                courseId: raw.id,
                instructorId: raw.instructorId,
            });

            return CourseEntity.rehydrate(raw);
        }
        catch (error) {
            logger.error("Course creation failed", {
                error_message: error.message,
                stack_trace: error.stack,
                courseId: course.id,
                instructorId: course.instructorId,
                payload: persistenceData,
            });

            throw error;
        }
    }

    async findByLessonId(lessonId) {
        const raw = await this.prisma.course.findFirst({
            where: {
                modules: {
                    some: {
                        lessons: {
                            some: {
                                id: lessonId,
                            }
                        }
                    }
                }
            },
            select: CourseRepository.baseQuery,
        });

        return CourseEntity.rehydrate(raw);
    }

    static baseQuery = buildQuery(courseSchema);
}