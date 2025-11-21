// import { prisma, modifyCourseUsecase } from "../../../src/composition-root"
// import { course, input } from "./modify-course.test-data"
// import { outputSchema } from "../../../src/application_layer/courses/modify-course.usecase";
// import { ZodError } from "zod"

// jest.setTimeout(20000);

// describe('Get users integration test', () => {
//     beforeAll(async () => {
//     })

//     afterAll(async () => {
//     })

//     describe('Normal case', () => {
//         let test_input = input;
//         let test_output;

//         beforeAll(async () => {
//             try {
//                 test_output = await getUserUsecase.execute(test_input);
//             }
//             catch (e) {
//                 test_output = e;
//             }
//         });

//         it(`Should return object match the schema`, () => {
//             expect(() => outputSchema.parse(test_output)).not.toThrow()
//         });
//     });

//     // describe('Abnormal case', () => {
//     //     describe('Not found course case', () => {
//     //         let test_input = structuredClone(input);
//     //         let test_output;

//     //         beforeAll(async () => {
//     //             test_input.id = "unknown";

//     //             try {
//     //                 test_output = await modifyCourseUsecase.execute(test_input);
//     //             }
//     //             catch (e) {
//     //                 test_output = e;
//     //             }
//     //         });

//     //         it(`Should return error message`, () => {
//     //             expect(test_output.message).toBe(`Course not found, ${test_input.id}`);
//     //         });
//     //     });

//     //     describe('Empty title course case', () => {
//     //         let inputClone = structuredClone(input);
//     //         let test_output;

//     //         beforeAll(async () => {
//     //             inputClone.title = "";

//     //             try {
//     //                 test_output = await modifyCourseUsecase.execute(inputClone);
//     //             }
//     //             catch (e) {
//     //                 test_output = e;
//     //             }
//     //         });

//     //         it("Should return error message", () => {
//     //             expect(test_output).toBeInstanceOf(ZodError);
//     //             expect(test_output.issues[0].message).toBe("Title cannot be empty");
//     //         });
//     //     });

//     //     describe('Negative price course case', () => {
//     //         let test_input = structuredClone(input);
//     //         let test_output;

//     //         beforeAll(async () => {
//     //             test_input.price = -1;

//     //             try {
//     //                 test_output = await modifyCourseUsecase.execute(test_input);
//     //             }
//     //             catch (e) {
//     //                 test_output = e;
//     //                 console.log(test_output);
//     //             }
//     //         });

//     //         it(`Should return error message`, () => {
//     //             expect(test_output).toBeInstanceOf(ZodError);
//     //             expect(test_output.issues[0].message).toBe("Price must be >= 0");
//     //         });
//     //     });
//     // });
// });