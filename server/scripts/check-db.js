import { prisma } from "../src/composition-root.js";

var result = await prisma.course.findMany();
console.log(result);