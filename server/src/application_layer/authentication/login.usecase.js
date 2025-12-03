import z from "zod";
import { ERROR_CATALOG } from "../../../constants/errors.js";
import { generateJWT, verifyPassword } from "../../utils/encrypt.js";
import { logger } from "../../utils/logger.js";

const inputSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const outputSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    fullname: z.string(),
    role: z.array(z.string()),
  }),
});

export class LoginUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(input) {
    logger.debug("Executing login operation", input);

    const parsedInput = inputSchema.parse(input);

    const user = await this.userRepository.findByEmail(parsedInput.email);
    if (!user) throw new Error(ERROR_CATALOG.LOGIN.message);

    const isPasswordValid = verifyPassword(parsedInput.password, user.password);
    if (!isPasswordValid) throw new Error(ERROR_CATALOG.LOGIN.message);

    const accessJwt = generateJWT({ id: user.id, roles: user.roles.map((r) => r.name) });

    logger.debug("Finish login operation");

    return outputSchema.parse({
      accessToken: accessJwt,
      user: {
        ...user,
        fullname: user.name || user.username || user.email.split("@")[0],
        role: user.roles.map((r) => r.name),
      },
    });
  }
}
