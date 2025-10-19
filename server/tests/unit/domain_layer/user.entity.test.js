import { UserEntity } from "../../../src/domain_layer/user.entity";

describe.only("User entity", () => {
    const testId = 1;
    const testEmail = 'test@example.com';
    const testPassword = 'securePassword123';
    const user = new UserEntity(testId, testEmail);
    user.password = testPassword;

    test('matchPassword returns true for correct password', () => {
        expect(user.matchPassword('securePassword123')).toBe(true);
    })

    test('matchPassword returns false for incorrect password', () => {
        expect(user.matchPassword('wrong')).toBe(false);
    })
})