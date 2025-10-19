import { prisma } from "../src/composition-root.js";

var roles = await prisma.userRole.findMany();
console.log(roles);