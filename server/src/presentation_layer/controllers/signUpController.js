import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['error', 'warn'],
});

async function createUser(req, res) {
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
        console.error("Error creating user:", err);
        res
            .status(500)
            .json({
                message: "An error occurred while creating the user."
            });
    }
};

export default createUser;