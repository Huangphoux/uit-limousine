import { prisma } from "../src/composition-root.js";

var result = await prisma.user.findMany();
console.log(result);