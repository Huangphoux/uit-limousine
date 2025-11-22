import { logger } from "../../utils/logger";

export class UserReadAccessor {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getLessonProgresses(userId) {
        return await this.prisma.lessonProgress.findMany({
            where: { userId },
            select: {
                lessonId: true,
                progress: true,
            },
        });
    }

    async findUsers({ select, role, page = 1, limit = 10 }) {
        // build filter
        const filter = role ? {
            roles: {
                some: {
                    role: {
                        name: role
                    }
                }
            }
        } : {};

        // pagination
        const skip = (page - 1) * limit;
        const take = limit;

        logger.debug('Executing database query for user list', {
            filter_role: role,
            skip_offset: skip,
            take_limit: take,
            select_keys_count: Object.keys(select).length
        });

        // run queries in parallel
        const [total, users] = await Promise.all([
            this.prisma.user.count({ where: filter }),
            this.prisma.user.findMany({ where: filter, select, skip, take }),
        ]);

        logger.debug('Database query completed', {
            actual_total_count: total,
            returned_user_count: users.length
        });

        return { total, users };
    }
}