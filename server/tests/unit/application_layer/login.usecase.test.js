import jwt from "jsonwebtoken";
import { LoginUseCase } from "../../../src/application_layer/login.usecase";
import { UserEntity } from "../../../src/domain_layer/user.entity";

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe.only("LoginUseCase", () => {
    let testEmail = "test@gmail.com";
    let testPassword = "test";
    let mockUser;    
    let mockUserRepo;
    let mockTokenRepo;
    let loginUseCase;
    let jwtSecret = 'secret';
    let jwtExpiry = '1h';

    beforeEach(() => {
        mockUser = new UserEntity(1, testEmail, testPassword)
        mockUserRepo = {
            findByEmail: jest.fn(),
        };
        mockTokenRepo = {
            add: jest.fn(),
        };
        loginUseCase = new LoginUseCase(mockUserRepo, mockTokenRepo, jwtSecret, jwtExpiry);
        jest.clearAllMocks();
    })

    test("throws error if user not found",
        async () => {
            mockUserRepo.findByEmail.mockResolvedValue(null);
            await expect(loginUseCase.execute({ email: testEmail, password: testPassword }))
                        .rejects.toThrow(LoginUseCase.LOGIN_ERROR_MESSAGE)
        }
    )

    test("throws error if password is invalid",
        async () => {
            mockUserRepo.findByEmail.mockResolvedValue(mockUser);
            await expect(loginUseCase.execute({ email: testEmail, password: "not_test" }))
                        .rejects.toThrow(LoginUseCase.LOGIN_ERROR_MESSAGE);
        }
    )

    test("return jwt token and save token if email and password are valid", 
        async () => {
            mockUserRepo.findByEmail.mockResolvedValue(mockUser);
            const mockJwt = 'fake.jwt.token';
            jwt.sign.mockReturnValue(mockJwt);
            
            const result = await loginUseCase.execute({ email: testEmail, password: testPassword });
            expect(result).toBe(mockJwt);
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockUser.id, email: mockUser.email },
                jwtSecret,
                { expiresIn: jwtExpiry }
            );
            expect(mockTokenRepo.add).toHaveBeenCalled();
        }
    )
})