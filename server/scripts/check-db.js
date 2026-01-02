import { prisma } from "../src/composition-root.js";

console.log(await prisma.lessonResource.findMany()
)