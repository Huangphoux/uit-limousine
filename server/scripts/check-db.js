import { prisma, courseRepository } from "../src/composition-root.js";

// var result = await courseRepository.findById("914e3354-b847-4af3-a429-11cc2e961a07");
var result = await prisma.role.findMany()
console.log(result);