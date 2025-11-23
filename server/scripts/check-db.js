import { prisma } from "../src/composition-root.js";
import { courseSchema } from "../src/domain_layer/course/course.entity.js";
import { buildQuery } from "../src/utils/query-builder.js";
import z from "zod";

console.log(await prisma.course.findMany(select));
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