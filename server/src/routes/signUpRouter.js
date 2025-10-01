import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const signUpRouter = Router();
const prisma = new PrismaClient({
    log: ['error', 'warn'],
})

signUpRouter.post("/api/sign-up", async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            }
        });

        res.status(201).json({
            message: "User created successfully",
            user: user
        });

    } catch (err) {
        res.json({
            message: `Error: ${err}`
        });
    }
});



export default signUpRouter;