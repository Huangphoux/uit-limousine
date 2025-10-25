import request from 'supertest';
import app from '../../src/app.js';
import { SUCCESS_CATALOG } from '../../constants/messages.js';
import { prisma } from '../../src/composition-root.js';
import { ERROR_CATALOG } from '../../constants/errors.js';
import { email, password, username } from './register.test-data.js';

jest.setTimeout(20000);

describe.only('Register integration test', () => {
    let input;
    let output;

    describe('Normal case', () => {
        beforeAll(async () => {
            input = { email: email, password: password, username: username };
            output = await request(app).post('/auth/register').send(input);
        });

        afterAll(async () => {
            await prisma.user.delete({ where: { email: email } });
        });

        it(`Should return status ${SUCCESS_CATALOG.REGISTER.status}`, () => {
            expect(output.status).toBe(SUCCESS_CATALOG.REGISTER.status);
        });

        it('Should return access token', () => {
            expect(output.body.data).toHaveProperty("accessToken");
        });

        it('Should return registered email', () => {
            expect(output.body.data.user).toHaveProperty("email", email);
        });

        it(`Should return message ${SUCCESS_CATALOG.REGISTER.message}`, () => {
            expect(output.body.message).toEqual(SUCCESS_CATALOG.REGISTER.message);
        });
    });

    describe('Abnormal case', () => {
        describe('Registered email case', () => {
            beforeAll(async () => {
                await prisma.user.create({
                    data: { email: email },
                });
                input = { email: email, password: password, username: username };
                output = await request(app).post('/auth/register').send(input);
            });

            afterAll(async () => {
                await prisma.user.delete({
                    where: { email: email },
                })
            });

            it(`Should return error message ${ERROR_CATALOG.REGISTER.message}`, () => {
                expect(output.body.message).toEqual(ERROR_CATALOG.REGISTER.message);
            });
        })
    });
});