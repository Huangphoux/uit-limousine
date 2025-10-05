import { LogoutUseCase } from "../../../src/application_layer/logout.usecase";

describe.only("LogoutUseCase", () => {
    let mockTokenRepo;
    let logoutUseCase;

    beforeEach(() => {
        mockTokenRepo = {
            remove: jest.fn(),
        };
        logoutUseCase = new LogoutUseCase(mockTokenRepo);
        jest.clearAllMocks();
    })

    test("calls tokenRepository.remove with jwtToken and returns true", 
        async () => {
            const mockToken = 'fake.jwt.token';
            const result = await logoutUseCase.execute({ token: mockToken });
            
            expect(result).toBe(true);
            expect(mockTokenRepo.remove).toHaveBeenCalledWith(mockToken);
        }
    )
})