import app from '../../../src/app.js';
import request from 'supertest';
import { prisma } from '../../../src/composition-root.js';
import { course, user, userRole } from './search-courses.test-data.js';

// {
//   "success": true,
//   "data": {
//     "courses": [
//       {
//         "id": "uuid",
//         "title": "Introduction to Node.js",
//         "description": "Learn Node.js from scratch",
//         "instructor": {
//           "id": "uuid",
//           "fullName": "Tran Van C"
//         },
//         "thumbnail": "https://cdn.example.com/thumbnails/course.jpg",
//         "rating": 4.5,
//         "enrollmentCount": 120,
//         "price": 500000,
//         "createdAt": "2025-01-01T00:00:00Z"
//       }
//     ],
//     "total": 50,
//     "page": 1,
//     "totalPages": 5
//   }
// }

jest.setTimeout(20000);

describe('Search courses integration test', () => {
    let input;
    let output;

    beforeAll(async () => {
        await prisma.user.create({ data: user });
        await prisma.userRole.create({ data: userRole });
        await prisma.course.create({ data: course });
    });

    afterAll(async () => {
        await prisma.course.deleteMany({
            where: {
                instructor: { email: user.email },
            },
        });
        await prisma.userRole.deleteMany({
            where: {
                user: { email: user.email },
            },
        });
        await prisma.user.deleteMany({
            where: {
                email: user.email,
            },
        });
    });
    // GET /courses?search=nodejs&category=programming&level=BEGINNER&page=1&limit=10
    describe('Normal case', () => {
        describe('Unit search case', () => {
            beforeAll(async () => {
                input = { search: course.title };
                output = await request(app).get('/courses').query(input);
                // console.log(util.inspect(output.body, { depth: null, colors: true }));
            });

            it('Should return status 200', () => {
                expect(output.status).toBe(200);
            });

            it('Should return created course title', () => {
                expect(output.body.data.courses[0]).toHaveProperty("title", course.title);
            });
        });

        describe('Combination search case', () => {
            beforeAll(async () => {
                input = { search: course.title, category: course.category, level: course.level, page: 1 };
                output = await request(app).get('/courses').query(input);
                // console.log(util.inspect(output.body, { depth: null, colors: true }));
            });

            it('Should return status 200', () => {
                expect(output.status).toBe(200);
            });

            it('Should return created course title', () => {
                expect(output.body.data.courses[0]).toHaveProperty("title", course.title);
            });
        });
    });

    describe('Abnormal case', () => {
        describe('Unexisting title search case', () => {
            beforeAll(async () => {
                input = { search: "fail", category: course.category, level: course.level };
                output = await request(app).get('/courses').query(input);
                // console.log(util.inspect(output.body, { depth: null, colors: true }));
            });

            it('Should return status 200', () => {
                expect(output.status).toBe(200);
            });

            it('Should return created course title', () => {
                expect(output.body.data.courses).toHaveLength(0);
            });
        });

        describe('Mismatched category search case', () => {
            beforeAll(async () => {
                input = { search: course.title, category: "fail", level: course.level };
                output = await request(app).get('/courses').query(input);
                // console.log(util.inspect(output.body, { depth: null, colors: true }));
            });

            it('Should return status 200', () => {
                expect(output.status).toBe(200);
            });

            it('Should return created course title', () => {
                expect(output.body.data.courses).toHaveLength(0);
            });
        });

        describe('Mismatched level search case', () => {
            beforeAll(async () => {
                input = { search: course.title, category: course.category, level: "fail" };
                output = await request(app).get('/courses').query(input);
                // console.log(util.inspect(output.body, { depth: null, colors: true }));
            });

            it('Should return status 200', () => {
                expect(output.status).toBe(200);
            });

            it('Should return created course title', () => {
                expect(output.body.data.courses).toHaveLength(0);
            });
        });

        describe('Exceed page limit search case', () => {
            beforeAll(async () => {
                input = { search: course.title, category: course.category, level: course.level, page: 2 };
                output = await request(app).get('/courses').query(input);
                // console.log(util.inspect(output.body, { depth: null, colors: true }));
            });

            it('Should return status 200', () => {
                expect(output.status).toBe(200);
            });

            it('Should return created course title', () => {
                expect(output.body.data.courses).toHaveLength(0);
            });
        });

        describe('0 limit search case', () => {
            beforeAll(async () => {
                input = { search: course.title, category: course.category, level: course.level, limit: 0 };
                output = await request(app).get('/courses').query(input);
                // console.log(util.inspect(output.body, { depth: null, colors: true }));
            });

            it('Should return status 200', () => {
                expect(output.status).toBe(200);
            });

            it('Should return created course title', () => {
                expect(output.body.data.courses).toHaveLength(0);
            });
        });

        describe('Negative page search case', () => {
            beforeAll(async () => {
                input = { search: course.title, category: course.category, level: course.level, page: -1 };
                output = await request(app).get('/courses').query(input);
                // console.log(util.inspect(output.body, { depth: null, colors: true }));
            });

            it('Should return status 200', () => {
                expect(output.status).toBe(200);
            });

            it('Should return created course title', () => {
                expect(output.body.data.courses[0]).toHaveProperty("title", course.title);
            });
        });

        describe('Negative limit search case', () => {
            beforeAll(async () => {
                input = { search: course.title, category: course.category, level: course.level, limit: -1 };
                output = await request(app).get('/courses').query(input);
                // console.log(util.inspect(output.body, { depth: null, colors: true }));
            });

            it('Should return status 200', () => {
                expect(output.status).toBe(200);
            });

            it('Should return created course title', () => {
                expect(output.body.data.courses[0]).toHaveProperty("title", course.title);
            });
        });
    });
});