import { outputSchema } from "../../../src/application_layer/courses/create-course.usecase";
import { prisma, createCourseUsecase } from "../../../src/composition-root";
import { input, getInstructor } from "./test-data";

jest.setTimeout(20000);

describe("Create course integration test", () => {
  let instructor;
  let instructorRole;

  beforeAll(async () => {
    // Find or create role to satisfy foreign key constraint
    instructorRole = await prisma.role.upsert({
      where: { name: "INSTRUCTOR" },
      update: {},
      create: { name: "INSTRUCTOR", desc: "Course instructor" },
    });

    instructor = getInstructor(instructorRole.id);
    await prisma.user.create({ data: instructor });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: instructor.id } });
  });

  describe("Normal case", () => {
    let test_input = input;
    let test_output;

    beforeAll(async () => {
      try {
        // Ensure instructor exists before creating course
        const existingInstructor = await prisma.user.findUnique({
          where: { id: instructor.id },
          include: { roles: true },
        });
        console.log("Instructor exists:", !!existingInstructor);

        test_output = await createCourseUsecase.execute(test_input);

        console.log("Course creation successful, output type:", typeof test_output);
      } catch (e) {
        console.log("Course creation failed with error:", e.message);
        test_output = e;
      }
    });

    it(`Should return object match the schema`, () => {
      console.log("=== DEBUG TEST OUTPUT ===");
      console.log("test_output:", JSON.stringify(test_output, null, 2));
      console.log("test_output keys:", Object.keys(test_output || {}));
      console.log("test_output type:", typeof test_output);
      console.log("Is Error?:", test_output instanceof Error);
      console.log("=========================");

      // If test_output is an error, throw it to see the actual error
      if (test_output instanceof Error) {
        throw test_output;
      }

      // Ensure we have a valid object before schema validation
      expect(test_output).toBeDefined();
      expect(typeof test_output).toBe("object");
      expect(test_output).not.toBeNull();

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
