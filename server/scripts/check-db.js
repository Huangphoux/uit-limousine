import { prisma } from "../src/composition-root.js";
import { toPersistence } from "../src/domain_layer/domain_service/factory.js";
import { userSchema } from "../src/domain_layer/user.entity.js";
import { buildQuery } from "../src/utils/query-builder.js";
import z from "zod";

console.dir(buildQuery(userSchema), { depth: null })
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