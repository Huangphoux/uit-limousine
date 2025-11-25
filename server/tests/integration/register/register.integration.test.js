import { prisma, registerUseCase } from '../../../src/composition-root.js';
import { input } from './test-data.js';
import { Role } from '../../../src/domain_layer/role.entity.js';
import z from "zod";

jest.setTimeout(20000);

export const testOutputSchema = z.object({
    id: z.string(),
    email: z.literal(input.email),
    fullName: z.literal(input.fullName),
    role: z.literal(Role.LEARNER),
    emailVerified: z.literal(false),
    createdAt: z.date(),
})

describe.only('Register integration test', () => {
    let test_input;
    let test_output;

    describe('Normal case', () => {
        beforeAll(async () => {
            test_input = input;
            try {
                test_output = await registerUseCase.execute(test_input);
            }
            catch (e) {
                test_output = e;
            }
        });

        afterAll(async () => {
            await prisma.user.delete({ where: { email: test_input.email } });
        });

        it(`Should return object match the schema`, () => {
            expect(() => testOutputSchema.parse(test_output)).not.toThrow()
        });
    });
});