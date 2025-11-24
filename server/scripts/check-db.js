import { prisma } from "../src/composition-root.js";
import { userSchema } from "../src/domain_layer/user.entity.js";
import { buildQuery } from "../src/utils/query-builder.js";
import z from "zod";

// console.log(await prisma.course.findMany(select));
console.log(buildQuery(userSchema));
// console.log(await prisma.course.findMany({
//     select: {
//         id: true,
//         modules: {
//             select: {
//                 id: true,
//             }
//         }
//     }
// }));