import app from '../../src/app.js';
import request from 'supertest';
import { prisma } from '../../src/composition-root.js';
import util from 'node:util';

// {
//             "courses": [
//                 {
//                     "id": "uuid",
//                     "title": "Introduction to Node.js",
//                     "description": "Learn Node.js from scratch",
//                     "instructor": {
//                         "id": "uuid",
//                         "fullName": "Tran Van C"
//                     },
//                     "thumbnail": "https://cdn.example.com/thumbnails/course.jpg",
//                     "rating": 4.5,
//                     "enrollmentCount": 120,
//                     "price": 500000,
//                     "createdAt": "2025-01-01T00:00:00Z"
//                 }
//             ],
//             "total": 50,
//             "page": 1,
//             "totalPages": 5
//         }

jest.setTimeout(20000);

describe('Search Courses Integration Test', () => {
    const search = 'Introduction to Node.js';

    beforeAll(async () => {
        await prisma.$connect();
        const instructorRole = await prisma.role.findUnique({
            where: {
                name: "INSTRUCTOR",
            }
        })
        await prisma.user.createMany({
            data: [
                {
                    email: 'tran.van.c@example.com',
                    username: 'tranvc',
                    name: 'Tran Van C',
                    bio: 'Senior JavaScript Instructor',
                    avatarUrl: 'https://cdn.example.com/avatars/tranvc.jpg',
                },
                {
                    email: 'nguyen.thi.a@example.com',
                    username: 'nguyena',
                    name: 'Nguyen Thi A',
                    bio: 'Expert in Web Development',
                    avatarUrl: 'https://cdn.example.com/avatars/nguyena.jpg',
                },
                {
                    email: 'le.ho.b@example.com',
                    username: 'lehb',
                    name: 'Le Ho B',
                    bio: 'Fullstack Developer and Instructor',
                    avatarUrl: 'https://cdn.example.com/avatars/lehb.jpg',
                }
            ],
            skipDuplicates: true, // prevent duplicate emails
        });
        const createdUsers = await prisma.user.findMany({
            where: {
                email: { in: ['tran.van.c@example.com', 'nguyen.thi.a@example.com', 'le.ho.b@example.com'] },
            },
        });
        for (const user of createdUsers) {
            await prisma.userRole.upsert({
                where: {
                    userId_roleId: {
                        userId: user.id,
                        roleId: instructorRole.id,
                    },
                },
                update: {},
                create: {
                    userId: user.id,
                    roleId: instructorRole.id,
                },
            });
        }
        await prisma.course.createMany({
            data: [{
                title: "Introduction to Node.js",
                slug: "introduction-to-nodejs",
                shortDesc: "Learn Node.js basics",
                description: "Learn Node.js from scratch, covering core concepts and building your first app.",
                language: "en",
                level: "Beginner",
                price: 500000,
                published: true,
                publishDate: new Date("2025-01-01T00:00:00Z"),
                coverImage: "https://cdn.example.com/thumbnails/course.jpg",
                instructorId: createdUsers[0].id,
            },
            {
                title: "Advanced TypeScript",
                slug: "advanced-typescript",
                shortDesc: "Master TypeScript features",
                description: "Deep dive into TypeScript, generics, decorators, and advanced patterns.",
                language: "en",
                level: "Advanced",
                price: 700000,
                published: true,
                publishDate: new Date("2025-02-01T00:00:00Z"),
                coverImage: "https://cdn.example.com/thumbnails/ts.jpg",
                instructorId: createdUsers[0].id,
            },
            {
                title: "React for Beginners",
                slug: "react-for-beginners",
                shortDesc: "Learn React from scratch",
                description: "Step by step guide to building interactive web apps with React.",
                language: "en",
                level: "Beginner",
                price: 600000,
                published: true,
                publishDate: new Date("2025-03-01T00:00:00Z"),
                coverImage: "https://cdn.example.com/thumbnails/react.jpg",
                instructorId: createdUsers[0].id,
            }],
            skipDuplicates: true, // prevent duplicate slugs
        });
    })

    afterAll(async () => {
        await prisma.course.deleteMany();
        await prisma.$disconnect();
    })

    test('should return success code and response JSON',
        async () => {
            const res = await request(app).get('/courses').query({ search });
            console.log(util.inspect(res.body, { depth: null, colors: true }));
        })
})