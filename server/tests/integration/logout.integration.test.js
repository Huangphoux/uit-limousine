import express from 'express';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { createLogoutRouter } from '../../src/presentation_layer/routes/logout.route.js';
import { TokenRepositoryPostgree } from '../../src/infrustructure_layer/token.repository.postgree.js';
import { LogoutUseCase } from '../../src/application_layer/logout.usecase.js';
import { LogoutController } from '../../src/presentation_layer/controllers/logout.controller.js';

jest.setTimeout(20000);

describe('Logout Integration Test', () => {
    let app;
    let prisma;
    let tokenRepo;
    let useCase;
    let mockToken = 'fake.jwt.token';
    let testEmail = "test@gmail.com";
    let testUser;

    beforeAll(async () => {
        prisma = new PrismaClient();
        await prisma.$connect();

        testUser = await prisma.user.create({
            data: {
                username: "test",
                email: testEmail,
                password: "test"
            }
        });

        tokenRepo = new TokenRepositoryPostgree();
        useCase = new LogoutUseCase(tokenRepo);

        app = express();
        app.use(express.json());
        app.use(createLogoutRouter(useCase));
    });

    beforeEach(async () => {
        await prisma.token.create({
            data: {
                token: mockToken,
                userId: testUser.id
            }
        });
    })

    afterAll(async () => {
        await prisma.token.deleteMany({ where: { token: mockToken } });
        await prisma.user.deleteMany({ where: {id: testUser.id } });
        await prisma.$disconnect();
    });

    test('POST /logout returns 200', async () => {
        const res = await request(app)
            .post('/logout')
            .send({ token: mockToken });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(LogoutController.LOGOUT_MESSAGE);
    });

    test('POST /logout DB delete', async () => {
        await request(app)
            .post('/logout')
            .send({ token: mockToken });

        const token = await prisma.token.findUnique({ where: { token: mockToken } });
        expect(token).toBeNull();
    });

    test('POST /logout 401 if wrong token', async () => {
        const res = await request(app)
            .post('/logout')
            .send({ token: "mockToken" });

        expect(res.status).toBe(401);
    });
});