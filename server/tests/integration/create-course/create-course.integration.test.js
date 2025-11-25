import { outputSchema } from "../../../src/application_layer/courses/create-course.usecase";
import { prisma, createCourseUsecase } from "../../../src/composition-root"
import { input, instructor } from "./test-data";

jest.setTimeout(20000);

describe('Create course integration test', () => {
    beforeAll(async () => {
        await prisma.user.create({ data: instructor });
    })

    afterAll(async () => {
        await prisma.user.delete({ where: { id: instructor.id } });
    })

    describe('Normal case', () => {
        let test_input = input;
        let test_output;

        beforeAll(async () => {
            try {
                test_output = await createCourseUsecase.execute(test_input);
            }
            catch (e) {
                test_output = e;
            }
        });

        it(`Should return object match the schema`, () => {
            expect(() => outputSchema.parse(test_output)).not.toThrow();
        });
    });

    // describe('Abnormal case', () => {
    //     describe('Not found user case', () => {
    //         let test_input = structuredClone(input);
    //         let test_output;

    //         beforeAll(async () => {
    //             test_input.id = "unknown";

    //             try {
    //                 test_output = await changeRoleUsecase.execute(test_input);
    //             }
    //             catch (e) {
    //                 test_output = e;
    //             }
    //         });

    //         it(`Should return error message`, () => {
    //             expect(test_output.message).toBe(`User not found, ${test_input.id}`);
    //         });
    //     });

    //     describe('Not found role case', () => {
    //         let test_input = structuredClone(input);
    //         let test_output;

    //         beforeAll(async () => {
    //             test_input.role = "unknown";

    //             try {
    //                 test_output = await changeRoleUsecase.execute(test_input);
    //             }
    //             catch (e) {
    //                 test_output = e;
    //             }
    //         });

    //         it(`Should return error message`, () => {
    //             expect(test_output.message).toBe(`Role not found, ${test_input.role}`);
    //         });
    //     });
    // });
});