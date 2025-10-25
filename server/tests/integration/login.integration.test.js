import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/composition-root.js';
import { ERROR_CATALOG } from '../../constants/errors.js';
import { createUserData, userSignInData } from './login.test-data.js';
import { SUCCESS_CATALOG } from '../../constants/messages.js';

jest.setTimeout(40000);

describe('Login integration test', () => {
    let createdUserData;
    let output;

    beforeAll(async () => {
        createdUserData = await createUserData();
        await prisma.user.create({
            data: createdUserData,
        });
    });

    afterAll(async () => {
        await prisma.$transaction([
            prisma.token.deleteMany({ where: { user: { email: createdUserData.email } } }),
            prisma.user.deleteMany({ where: { email: createdUserData.email } }),
        ]);
    })

    describe('Login successfully', () => {
        beforeAll(async () => {
            output = await request(app).post('/auth/login').send(userSignInData);
        });

        it('Should return 201', () => {
            expect(output.status).toBe(SUCCESS_CATALOG.LOGIN.status);
        });
    })


    // let path = '/auth/login';

    // beforeAll(async () => {
    //     const res = await request(app).post('/auth/register').send(sentData);
    //     if (res.status !== 201) {
    //         console.error('User registration failed in beforeAll:', res.body);
    //     }
    // });

    // afterAll(async () => {
    //     await prisma.$transaction([
    //         prisma.token.deleteMany({ where: { user: { email: testEmail } } }),
    //         prisma.user.deleteMany({ where: { email: testEmail } }),
    //     ]);
    //     await prisma.$disconnect();
    // });

    // test('should return status code 200 and create access token', async () => {
    //     const res = await request(app)
    //         .post(path)
    //         .send({ email: testEmail, password: testPassword });

    //     expect(res.status).toBe(200);

    //     const accessToken = await prisma.token.findUnique({
    //         where: { token: res.body.data.accessToken },
    //         select: { id: true },
    //     });
    //     expect(accessToken).not.toBeNull();

    //     const refreshToken = await prisma.token.findUnique({
    //         where: { token: res.body.data.refreshToken },
    //         select: { id: true },
    //     });
    //     expect(refreshToken).not.toBeNull();

    //     expect(res.body.data.user.email).toBe(testEmail);
    // });

    // test(`should return status code ${ERROR_CATALOG.LOGIN.status} and error message on wrong password`, async () => {
    //     const res = await request(app)
    //         .post(path)
    //         .send({ email: 'test@example.com', password: 'wrong' });

    //     expect(res.status).toBe(ERROR_CATALOG.LOGIN.status);
    //     expect(res.body.message).toBe(ERROR_CATALOG.LOGIN.message);
    // });

    // test(`should return status code ${ERROR_CATALOG.LOGIN.status} and error message on wrong email`, async () => {
    //     const res = await request(app)
    //         .post(path)
    //         .send({ email: 'no@example.com', password: 'secret' });

    //     expect(res.status).toBe(ERROR_CATALOG.LOGIN.status);
    //     expect(res.body.message).toBe(ERROR_CATALOG.LOGIN.message);
    // });
});
