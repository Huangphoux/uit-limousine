import { RegisterUseCase } from "../../../src/application_layer/authentication/register.usecase";

describe.only('Register use case', () => {
    const testEmail = "user@example.com";
    const testPassword = "securePassword123";
    const testName = "Nguyen Van A";

    const userRepository = { add: jest.fn() };
    const registerUseCase = new RegisterUseCase(userRepository);

    test('should create an user on valid credentials',
        () => {
            const result = registerUseCase.execute({ email: testEmail, password: testPassword, fullname: testName });
            expect(result).toBe(true);
        }
    )
})