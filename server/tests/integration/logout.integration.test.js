import request from 'supertest';
import { prisma } from '../../src/composition-root.js';
import { SUCCESS_CATALOG } from '../../constants/messages.js';
import app from '../../src/app.js'

jest.setTimeout(20000);

describe('Logout integration test', () => {
    let path = '/auth/logout';
    let mockToken = 'fake.jwt.token';
    let testUser;

    let testUsername = "logout";
    let testEmail = 'logout@example.com';
    let testPassword = "logout";

    beforeAll(async () => {
        await prisma.$connect();

        testUser = await prisma.user.create({
            data: {
                username: testUsername,
                email: testEmail,
                password: testPassword
            }
        });
    });

    beforeEach(async () => {
        await prisma.token.create({
            data: {
                token: mockToken,
                userId: testUser.id
            }
        });
    })

    afterAll(async () => {
        await prisma.token.deleteMany({ where: { token: mockToken } });
        await prisma.user.deleteMany({ where: { email: testEmail } });
        await prisma.$disconnect();
    });

    test('should return success message and delete the created access token', async () => {
        const res = await request(app)
            .post(path)
            .send({ token: mockToken });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(SUCCESS_CATALOG.LOGOUT.message);

        const token = await prisma.token.findUnique({ where: { token: mockToken } });
        expect(token).toBeNull();
    });

    test('should return status code 200', async () => {
        const res = await request(app)
            .post(path)
            .send({ token: "mockToken" });

        expect(res.status).toBe(SUCCESS_CATALOG.LOGOUT.status);
    });
});