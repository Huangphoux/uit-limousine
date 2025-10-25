import { prisma } from "../src/composition-root.js";


await prisma.role.create({
    data: {
        name: "INSTRUCTOR"
    }
})
var result = await prisma.role.findMany();
console.log(result);