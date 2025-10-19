import request from 'supertest';
import app from '../../src/app.js';
import { SUCCESS_CATALOG } from '../../constants/messages.js';
import { prisma } from '../../src/composition-root.js';
import { ERROR_CATALOG } from '../../constants/errors.js';

jest.setTimeout(20000);

describe.only('Register integration test', () => {
    const path = '/auth/register';

    const testEmail = "user@example.com";
    const testPassword = "securePassword123";
    const testName = "Nguyen Van A";
    const sentData = { email: testEmail, password: testPassword, fullname: testName };

    afterAll(async () => {
        await prisma.$connect();
        await prisma.user.deleteMany({
            where: { email: testEmail },
        });
        await prisma.$disconnect();
    });

    test('should return successful status, message and JSON response',
        async () => {
            const res = await request(app)
                .post(path)
                .send(sentData);

            expect(res.status).toBe(SUCCESS_CATALOG.REGISTER.status);
            expect(res.body.message).toEqual(SUCCESS_CATALOG.REGISTER.message);

            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data).toHaveProperty('email', testEmail);
            expect(res.body.data).toHaveProperty('fullName', testName);
            expect(res.body.data).toHaveProperty('roles', ['LEARNER']);
            expect(res.body.data).toHaveProperty('emailVerified');
            expect(res.body.data).toHaveProperty('createdAt');
        });

    test('should throw error on registered email',
        async () => {
            const res = await request(app)
                .post(path)
                .send(sentData);

            expect(res.status).toBe(ERROR_CATALOG.REGISTER.status);
        })
})