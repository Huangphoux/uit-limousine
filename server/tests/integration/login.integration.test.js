import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { createLoginRouter } from '../../src/presentation_layer/routes/login.route.js';
import { UserRepositoryPostgree } from '../../src/infrustructure_layer/user.repository.postgree.js';
import { TokenRepositoryPostgree } from '../../src/infrustructure_layer/token.repository.postgree.js';
import { LoginUseCase } from '../../src/application_layer/login.usecase.js';

jest.setTimeout(20000);

describe('Login Integration Test', () => {
    let app;
    let prisma;
    let userRepo;
    let tokenRepo;
    let useCase;
    let jwtSecret = 'testsecret';
    let jwtExpiry = '1h';
    let testEmail = 'test@example.com';
    let testPassword = "secret";

    beforeAll(async () => {
        prisma = new PrismaClient();
        await prisma.$connect();

        await prisma.user.create({
            data: {
                username: 'testuser',
                email: testEmail,
                password: testPassword
            }
        });

        userRepo = new UserRepositoryPostgree();
        tokenRepo = new TokenRepositoryPostgree();
        useCase = new LoginUseCase(userRepo, tokenRepo, jwtSecret, jwtExpiry);

        app = express();
        app.use(express.json());
        app.use(createLoginRouter(useCase));
    });

    afterEach(async () => {
        await prisma.user.update({
            where: { email: testEmail},
            data: { tokens: { deleteMany: {} } },
        })
    })

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { email: testEmail } });
        await prisma.$disconnect();
    });

    test('POST /login response status returns 200 for valid credentials', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: testEmail, password: testPassword });

        expect(res.status).toBe(200);
    });

    test('POST /login returns valid token and stores it in DB for valid credentials', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: testEmail, password: testPassword });

        const decoded = jwt.verify(res.body.token, jwtSecret);
        expect(decoded).toHaveProperty('email', testEmail);
        expect(decoded).toHaveProperty('userId');

        const savedToken = await prisma.token.findUnique({
            where: { token: res.body.token },
        });
        expect(savedToken).not.toBeNull();
    });

    test('POST /login returns 401 for invalid password', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'wrong' });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe(LoginUseCase.LOGIN_ERROR_MESSAGE);
    });

    test('POST /login returns 401 for invalid email', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'no@example.com', password: 'secret' });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe(LoginUseCase.LOGIN_ERROR_MESSAGE);
    });
});
