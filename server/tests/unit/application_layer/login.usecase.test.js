import { LoginUseCase } from "../../../src/application_layer/login.usecase";
import { config } from "../../../src/config.js"
import { ERROR_CATALOG } from "../../../constants/errors";

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe.only("Login use case", () => {
    const testEmail = "test@gmail.com";
    const testPassword = "test";
    const mockUser = { matchPassword: jest.fn() };

    const mockUserRepo = { findByEmail: jest.fn() };
    const mockTokenRepo = { add: jest.fn() };
    const loginUseCase = new LoginUseCase(mockUserRepo, mockTokenRepo, config.jwt);

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test("should throw error on unexisting email",
        async () => {
            mockUserRepo.findByEmail.mockResolvedValue(null);

            await expect(loginUseCase.execute({ email: testEmail, password: testPassword }))
                .rejects.toThrow(ERROR_CATALOG.LOGIN.message)
        }
    )

    test("should throw error on invalid password",
        async () => {
            mockUserRepo.findByEmail.mockResolvedValue(mockUser);
            mockUser.matchPassword.mockReturnValue(false);

            await expect(loginUseCase.execute({ email: testEmail, password: testPassword }))
                .rejects.toThrow(ERROR_CATALOG.LOGIN.message);
        }
    )

    test("should return jwt token and user on valid credentials",
        async () => {
            mockUserRepo.findByEmail.mockResolvedValue(mockUser);
            mockUser.matchPassword.mockReturnValue(true);

            const result = await loginUseCase.execute({ email: testEmail, password: testPassword });
            expect(result.token).toHaveProperty('access');
            expect(result.token).toHaveProperty('refresh');
            expect(result).toHaveProperty('user', mockUser);
        }
    )
})