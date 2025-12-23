import { prisma } from "../src/composition-root.js";

console.log(await prisma.user.findMany())