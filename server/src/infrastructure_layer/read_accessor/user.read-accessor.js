import { logger } from "../../utils/logger.js";

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

    // Thêm status vào destructuring tham số đầu vào
    async findUsers({ select, role, status, page = 1, limit = 10 }) {
        const filter = {
            ...(role && { roles: { some: { role: { name: role } } } }),
            ...(status && { status: status })
        };

        const skip = (page - 1) * limit;
        const take = limit;

        const finalSelect = {
            ...select, // select này bây giờ đã có { status: true } từ UseCase truyền xuống
            roles: {
                select: {
                    role: { select: { name: true } }
                }
            }
        };

        const [total, users] = await Promise.all([
            this.prisma.user.count({ where: filter }),
            this.prisma.user.findMany({
                where: filter,
                select: finalSelect,
                skip,
                take
            }),
        ]);

        const formattedUsers = users.map(user => ({
            ...user,
            roles: user.roles?.map(r => r.role.name) || [],
        }));

        return { total, users: formattedUsers };
    }
    async getIdByEmail(email) {
        return await this.prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
    }

    // Get user statistics (count by role and status)
    async getUserStats() {
        // Get all users count first
        const totalCount = await this.prisma.user.count();

        // Count by role using groupBy
        const roleStats = await this.prisma.user.findMany({
            select: {
                roles: {
                    select: {
                        role: { select: { name: true } }
                    }
                }
            }
        });

        // Process role counts (a user can have multiple roles)
        const roleCounts = {
            LEARNER: 0,
            INSTRUCTOR: 0,
            ADMIN: 0
        };

        roleStats.forEach(user => {
            user.roles?.forEach(r => {
                const roleName = r.role.name;
                if (roleCounts.hasOwnProperty(roleName)) {
                    roleCounts[roleName]++;
                }
            });
        });

        // Count by status
        const [activeCount, inactiveCount] = await Promise.all([
            this.prisma.user.count({ where: { status: "ACTIVE" } }),
            this.prisma.user.count({ where: { status: "INACTIVE" } })
        ]);

        return {
            total: totalCount,
            byRole: roleCounts,
            byStatus: {
                ACTIVE: activeCount,
                INACTIVE: inactiveCount
            }
        };
    }
    async isInstructor(id) {
        const count = await this.prisma.user.count({
            where: {
                id,
                roles: {
                    some: {
                        role: {
                            name: "INSTRUCTOR",
                        }
                    }
                }
            }
        });
        return count == 1;
    }
}