import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../../src/index.js';
import { prisma } from '../../src/composition-root.js';
import { config } from '../../src/config.js';
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

    test('Sucessful logging in test case', async () => {
        const res = await request(app)
            .post(path)
            .send({ email: testEmail, password: testPassword });

        expect(res.status).toBe(200);

        const decoded = jwt.verify(res.body.token, config.jwt.secret);
        expect(decoded).toHaveProperty('sub');

        const savedToken = await prisma.token.findUnique({
            where: { token: res.body.token },
        });
        expect(savedToken).not.toBeNull();
    });

    test('Wrong password logging in test case', async () => {
        const res = await request(app)
            .post(path)
            .send({ email: 'test@example.com', password: 'wrong' });

        expect(res.status).toBe(ERROR_CATALOG.LOGIN.status);
        expect(res.body.message).toBe(ERROR_CATALOG.LOGIN.message);
    });

    test('Wrong email logging in test case', async () => {
        const res = await request(app)
            .post(path)
            .send({ email: 'no@example.com', password: 'secret' });

        expect(res.status).toBe(ERROR_CATALOG.LOGIN.status);
        expect(res.body.message).toBe(ERROR_CATALOG.LOGIN.message);
    });
});
