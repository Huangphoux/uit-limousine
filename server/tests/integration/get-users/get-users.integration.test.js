import { prisma, getUsersUsecase } from "../../../src/composition-root"
import { outputSchema } from "../../../src/application_layer/instructor/get-users.usecase.js";
import { ZodError } from "zod"
import { user1, user2, input } from "./test-data.js";

jest.setTimeout(20000);

describe('Get users integration test', () => {
    beforeAll(async () => {
        await prisma.user.createMany({ data: [user1, user2] });
    })

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { id: { in: [user1.id, user2.id] } } });
    })

    describe('Normal case', () => {
        let test_input = input;
        let test_output;

        beforeAll(async () => {
            try {
                test_output = await getUsersUsecase.execute(test_input);
            }
            catch (e) {
                test_output = e;
            }
        });

        it(`Should return object match the schema`, () => {
            expect(() => outputSchema.parse(test_output)).not.toThrow()
        });
    });

    describe('Abnormal case', () => {
        describe('Negative page course case', () => {
            let test_input = structuredClone(input);
            let test_output;

            beforeAll(async () => {
                test_input.page = -1;

                try {
                    test_output = await getUsersUsecase.execute(test_input);
                }
                catch (e) {
                    test_output = e;
                }
            });

            it(`Should return error message`, () => {
                expect(test_output).toBeInstanceOf(ZodError);
                expect(test_output.issues[0].message).toBe("Page must be at least 1");
            });
        });

        describe('Negative limit course case', () => {
            let test_input = structuredClone(input);
            let test_output;

            beforeAll(async () => {
                test_input.limit = -1;

                try {
                    test_output = await getUsersUsecase.execute(test_input);
                }
                catch (e) {
                    test_output = e;
                }
            });

            it(`Should return error message`, () => {
                expect(test_output).toBeInstanceOf(ZodError);
                expect(test_output.issues[0].message).toBe("Limit must be at least 1");
            });
        });
    });
});