import { prisma } from "../src/composition-root.js";

var result = await prisma.enrollment.findMany();
console.log(result);