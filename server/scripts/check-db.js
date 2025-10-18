import { prisma } from "../src/composition-root.js";

var tokens = await prisma.token.findMany()
console.log("Token table:")
console.log(tokens)

var users = await prisma.user.findMany()
console.log("User table: ")
console.log(users)