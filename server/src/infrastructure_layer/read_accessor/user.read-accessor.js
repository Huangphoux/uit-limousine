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