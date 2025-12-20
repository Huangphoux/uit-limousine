import z from "zod";
import { UserEntity } from "../../domain_layer/user.entity.js";
import { logger } from "../../utils/logger.js";
import bcrypt from "bcrypt";

// Schema đầu vào: Admin cung cấp thông tin cơ bản
export const inputSchema = z.object({
    authId: z.string(), // ID của admin thực hiện lệnh
    email: z.string().email(),
    name: z.string().optional(),
    role: z.string().optional(),
});

export class CreateUserByAdminUsecase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);
        const log = logger.child({ task: "Admin creating user", adminId: parsedInput.authId });
        log.info("Task started");

        // 1. Kiểm tra email đã tồn tại chưa
        const existingUser = await this.userRepository.findByEmail(parsedInput.email);
        if (existingUser) {
            log.warn("Task failed: email already exists");
            throw new Error("Email already registered");
        }
        let roles = [];
        // ... bên trong hàm execute của UseCase ...
        if (parsedInput.role) {
            const roleDoc = await this.userRepository.findRoleByName(parsedInput.role);
            console.log(roleDoc);
            
            if (!roleDoc) {
                throw new Error(`Role '${parsedInput.role}' does not exist`);
            }

            // Gán đúng các trường mà Zod schema của UserRole yêu cầu
            // Nếu roleDoc.id của bạn là Number trong DB, hãy convert sang String nếu Zod bắt là String
            roles = [{
                roleId: String(roleDoc.id),
                userId: "" // Để trống vì User chưa được tạo, hoặc dùng UUID tạm
            }];            
        }
        // 2. Hash mật khẩu mặc định "123"
        const saltRounds = 10;
        const defaultPasswordHash = await bcrypt.hash("123", saltRounds);

        // 3. Tạo Entity User mới
        // Lưu ý: UserEntity.create của bạn cần nhận password đã hash
        const newUser = UserEntity.create({
            email: parsedInput.email,
            name: parsedInput.name,
            password: defaultPasswordHash,
            status: "ACTIVE", // Set mặc định ACTIVE khi admin tạo,
            roles: roles
        });
        console.log("New user entity created", newUser);
        // 4. Lưu vào database thông qua Repository
        const savedUser = await this.userRepository.add(newUser);

        log.info("Task completed: User created with default password '123'");

        // Trả về thông tin (không kèm password)
        return {
            id: savedUser.id,
            email: savedUser.email,
            name: savedUser.name,
            status: savedUser.status,
            roles: savedUser.roles,
        };
    }
}