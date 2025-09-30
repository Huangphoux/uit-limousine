import express from "express";
import dotenv from "dotenv";
import authorRouter from "./routes/authorRouter.js";
// const bookRouter = require("./routes/bookRouter");
// const indexRouter = require("./routes/indexRouter");
import { PrismaClient } from '@prisma/client';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const prisma = new PrismaClient()

app.use("/authors", authorRouter);
// app.use("/books", bookRouter);
// app.use("/", indexRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening to http://localhost:${PORT}`);
});

app.get('/', async (req, res) => {
  // await prisma.user.create({
  //   data: {
  //     name: 'Alice',
  //     email: 'alice@prisma.io',
  //     posts: {
  //       create: { title: 'Hello World', content: 'hey can i set this post content?' },
  //     },
  //     profile: {
  //       create: { bio: 'I like turtles' },
  //     },
  //   },
  // })

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });

  await prisma.post.update({
    where: { id: 2 },
    data: { published: true },
  })


  res.json(allUsers);
});


