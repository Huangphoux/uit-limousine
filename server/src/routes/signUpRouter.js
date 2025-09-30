import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const signUpRouter = Router();
const prisma = new PrismaClient({
    log: ['error', 'warn'],
})

signUpRouter.post("/sign-up", async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });

        res.status(201).json({
            message: "User created successfully",
            user: user
        });

    } catch (err) {
        if (err.code === 'P2002') {
            // Unique constraint violation
            res.status(400).json({
                message: "Username or email already exists"
            });
        } else {
            res.status(500).json({
                message: "Error creating user",
                error: err.message
            });
        }
    }
});



export default signUpRouter;