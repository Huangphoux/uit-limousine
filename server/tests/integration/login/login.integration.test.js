import request from 'supertest';
import app from '../../../src/app.js';
import { prisma } from '../../../src/composition-root.js';
import { ERROR_CATALOG } from '../../../constants/errors.js';
import { createUserData, email, password } from './login.test-data.js';
import { SUCCESS_CATALOG } from '../../../constants/messages.js';

jest.setTimeout(40000);

describe('Login integration test', () => {
    let createdUserData;
    let input
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

    describe('Normal case', () => {
        beforeAll(async () => {
            input = { email: email, password: password };
            output = await request(app).post('/auth/login').send(input);
        });

        it(`Should return status ${SUCCESS_CATALOG.LOGIN.status}`, () => {
            expect(output.status).toBe(SUCCESS_CATALOG.LOGIN.status);
        });

        it('Should return access token', () => {
            expect(output.body.data).toHaveProperty("accessToken")
        });

        it('Should return correct email', () => {
            expect(output.body.data.user).toHaveProperty("email", createdUserData.email);
        });
    });

    describe('Abnormal case', () => {
        let error;

        describe('Wrong email case', () => {
            beforeAll(async () => {
                input = { email: 'fail', password: password };
                output = await request(app).post('/auth/login').send(input);
                error = output.body;
            });

            it(`Should return error message ${ERROR_CATALOG.LOGIN.message}`, () => {
                expect(error.message).toEqual(ERROR_CATALOG.LOGIN.message);
            });
        });

        describe('Empty email case', () => {
            beforeAll(async () => {
                input = { email: '', password: password };
                output = await request(app).post('/auth/login').send(input);
                error = output.body;
            });

            it(`Should return error message ${ERROR_CATALOG.LOGIN.message}`, () => {
                expect(error.message).toEqual(ERROR_CATALOG.LOGIN.message);
            });
        });

        describe('Wrong password case', () => {
            beforeAll(async () => {
                input = { email: email, password: 'fail' };
                output = await request(app).post('/auth/login').send(input);
                error = output.body;
            });

            it(`Should return error message ${ERROR_CATALOG.LOGIN.message}`, () => {
                expect(error.message).toEqual(ERROR_CATALOG.LOGIN.message);
            });
        });

        describe('Empty password case', () => {
            beforeAll(async () => {
                input = { email: email, password: '' };
                output = await request(app).post('/auth/login').send(input);
                error = output.body;
            });

            it(`Should return error message ${ERROR_CATALOG.LOGIN.message}`, () => {
                expect(error.message).toEqual(ERROR_CATALOG.LOGIN.message);
            });
        });

        describe('Empty password case', () => {
            beforeAll(async () => {
                input = { email: '', password: '' };
                output = await request(app).post('/auth/login').send(input);
                error = output.body;
            });

            it(`Should return error message ${ERROR_CATALOG.LOGIN.message}`, () => {
                expect(error.message).toEqual(ERROR_CATALOG.LOGIN.message);
            });
        });
    });
});
