import { UserEntity } from "../../../src/domain_layer/user.entity";

describe.only("UserEntity", () => {
    const test_id = 1;
    const test_email = 'test@example.com';
    const test_password = 'securePassword123';

    test('matchPassword returns true for correct password', () => {
        const user = new UserEntity(test_id, test_email, test_password);
        expect(user.matchPassword('securePassword123')).toBe(true);
    })

    test('matchPassword returns false for incorrect password', () => {
        const user = new UserEntity(test_id, test_email, test_password);
        expect(user.matchPassword('wrong')).toBe(false);
    })
})