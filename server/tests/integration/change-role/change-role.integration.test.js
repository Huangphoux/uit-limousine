import { prisma, changeRoleUsecase } from "../../../src/composition-root"
import { user, input } from "./test-data";
import { outputSchema } from "../../../src/application_layer/instructor/change-role.usecase.js";

jest.setTimeout(20000);

describe('Change role integration test', () => {
    beforeAll(async () => {
        await prisma.user.create({ data: user });
    })

    afterAll(async () => {
        await prisma.user.delete({ where: { id: user.id } });
    })

    describe('Normal case', () => {
        let test_input = input;
        let test_output;

        beforeAll(async () => {
            try {
                test_output = await changeRoleUsecase.execute(test_input);
            }
            catch (e) {
                test_output = e;
            }
        });

        it(`Should return object match the schema`, () => {
            expect(() => outputSchema.parse(test_output)).not.toThrow();
        });
    });

    describe('Abnormal case', () => {
        describe('Not found user case', () => {
            let test_input = structuredClone(input);
            let test_output;

            beforeAll(async () => {
                test_input.id = "unknown";

                try {
                    test_output = await changeRoleUsecase.execute(test_input);
                }
                catch (e) {
                    test_output = e;
                }
            });

            it(`Should return error message`, () => {
                expect(test_output.message).toBe(`User not found, ${test_input.id}`);
            });
        });

        describe('Not found role case', () => {
            let test_input = structuredClone(input);
            let test_output;

            beforeAll(async () => {
                test_input.role = "unknown";

                try {
                    test_output = await changeRoleUsecase.execute(test_input);
                }
                catch (e) {
                    test_output = e;
                }
            });

            it(`Should return error message`, () => {
                expect(test_output.message).toBe(`Role not found, ${test_input.role}`);
            });
        });
    });
});