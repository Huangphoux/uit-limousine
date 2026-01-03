import { ModuleMapper } from "../mapper/module.mapper.js";

export class ModuleRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async getById(id) {
        const raw = await this.prisma.module.findUnique({
            where: { id },
            select: ModuleRepository.baseQuery,
        });

        return ModuleMapper.toDomain(raw);
    }

    async save(entity) {
        let raw = null;
        if (!entity)
            return raw;

        const persistence = ModuleMapper.toPersistence(entity)
        if (!entity.id) {
            raw = this.prisma.module.create({
                data: persistence
            });
        }
        else {
            raw = this.prisma.module.update({
                where: { id: entity.id },
                data: persistence
            });
        }

        return ModuleMapper.toDomain(await raw);
    }

    async deleteByIds(ids) {
        if (!ids || ids.length === 0) return;
        
        // First, delete all lessons in these modules to avoid foreign key constraint
        await this.prisma.lesson.deleteMany({
            where: { moduleId: { in: ids } }
        });
        
        // Then delete the modules
        await this.prisma.module.deleteMany({
            where: { id: { in: ids } }
        });
    }

    static baseQuery = {
        id: true,
        courseId: true,
        title: true,
        position: true,
        createdAt: true,
    }
}