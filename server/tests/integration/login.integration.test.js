import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/composition-root.js';
import { ERROR_CATALOG } from '../../constants/errors.js';

jest.setTimeout(20000);

describe('Login Integration Test', () => {
    let path = '/auth/login';
    let testUsername = "testuser";
    let testEmail = 'test@example.com';
    let testPassword = "secret";

    beforeAll(async () => {
        await prisma.$connect();

        await prisma.user.create({
            data: {
                username: testUsername,
                email: testEmail,
                password: testPassword
            }
        });
    });

    afterAll(async () => {
        await prisma.$transaction([
            prisma.token.deleteMany({ where: { user: { email: testEmail } } }),
            prisma.user.deleteMany({ where: { email: testEmail } }),
        ]);
        await prisma.$disconnect();
    });

    test('should return status code 200 and create access token', async () => {
        const res = await request(app)
            .post(path)
            .send({ email: testEmail, password: testPassword });

        expect(res.status).toBe(200);

        const accessToken = await prisma.token.findUnique({
            where: { token: res.body.data.accessToken },
            select: { id: true },
        });
        expect(accessToken).not.toBeNull();

        const refreshToken = await prisma.token.findUnique({
            where: { token: res.body.data.refreshToken },
            select: { id: true },
        });
        expect(refreshToken).not.toBeNull();

        expect(res.body.data.user.email).toBe(testEmail);
    });

    test(`should return status code ${ERROR_CATALOG.LOGIN.status} and error message on wrong password`, async () => {
        const res = await request(app)
            .post(path)
            .send({ email: 'test@example.com', password: 'wrong' });

        expect(res.status).toBe(ERROR_CATALOG.LOGIN.status);
        expect(res.body.message).toBe(ERROR_CATALOG.LOGIN.message);
    });

    test(`should return status code ${ERROR_CATALOG.LOGIN.status} and error message on wrong email`, async () => {
        const res = await request(app)
            .post(path)
            .send({ email: 'no@example.com', password: 'secret' });

        expect(res.status).toBe(ERROR_CATALOG.LOGIN.status);
        expect(res.body.message).toBe(ERROR_CATALOG.LOGIN.message);
    });
});
