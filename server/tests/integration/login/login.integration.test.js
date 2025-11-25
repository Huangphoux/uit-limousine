import { loginUseCase, prisma } from '../../../src/composition-root.js';
import { ERROR_CATALOG } from '../../../constants/errors.js';
import { user, input } from './test-data.js';
import { SUCCESS_CATALOG } from '../../../constants/messages.js';
import z from "zod";

jest.setTimeout(40000);

const testLoginSchema = z.object({
    accessToken: z.string(),
    user: z.object({
        id: z.literal(user.id),
        email: z.literal(user.email),
        fullname: z.literal(user.username),
        role: z.tuple([z.literal('LEARNER')])
    })
})

describe('Login integration test', () => {
    let test_input
    let test_output;

    beforeAll(async () => {
        await prisma.user.create({
            data: user,
        });
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { id: user.id } });
    })

    describe('Normal case', () => {
        beforeAll(async () => {
            test_input = input;

            try {
                test_output = await loginUseCase.execute(test_input);
            }
            catch (e) {
                test_output = e;
            }
        });

        it(`Should return object match the schema`, () => {
            expect(() => testLoginSchema.parse(test_output)).not.toThrow()
        });
    });

    describe('Abnormal case', () => {
        describe('Wrong email case', () => {
            beforeAll(async () => {
                test_input = structuredClone(input);
                test_input.email = "unknown";
                try {
                    test_output = await loginUseCase.execute(test_input);
                }
                catch (e) {
                    test_output = e;
                }
            });

            it(`Should return error message ${ERROR_CATALOG.LOGIN.message}`, () => {
                expect(test_output.message).toEqual(ERROR_CATALOG.LOGIN.message);
            });
        });

        describe('Empty email case', () => {
            beforeAll(async () => {
                test_input = structuredClone(input);
                test_input.email = "";
                try {
                    test_output = await loginUseCase.execute(test_input);
                }
                catch (e) {
                    test_output = e;
                }
            });

            it(`Should return error message ${ERROR_CATALOG.LOGIN.message}`, () => {
                expect(test_output.message).toEqual(ERROR_CATALOG.LOGIN.message);
            });
        });

        describe('Wrong password case', () => {
            beforeAll(async () => {
                test_input = structuredClone(input);
                test_input.password = "unknown";
                try {
                    test_output = await loginUseCase.execute(test_input);
                }
                catch (e) {
                    test_output = e;
                }
            });

            it(`Should return error message ${ERROR_CATALOG.LOGIN.message}`, () => {
                expect(test_output.message).toEqual(ERROR_CATALOG.LOGIN.message);
            });
        });

        describe('Empty password case', () => {
            beforeAll(async () => {
                test_input = structuredClone(input);
                test_input.password = "unknown";
                try {
                    test_output = await loginUseCase.execute(test_input);
                }
                catch (e) {
                    test_output = e;
                }
            });

            it(`Should return error message ${ERROR_CATALOG.LOGIN.message}`, () => {
                expect(test_output.message).toEqual(ERROR_CATALOG.LOGIN.message);
            });
        });
    });
});
