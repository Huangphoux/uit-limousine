import { prisma } from "../src/composition-root.js";

var result = await prisma.role.findMany();
console.log(result);