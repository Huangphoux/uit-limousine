import express from "express";
import dotenv from "dotenv";
import authorRouter from "./routes/authorRouter.js";  // Note: added .js extension

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

// const bookRouter = require("./routes/bookRouter");
// const indexRouter = require("./routes/indexRouter");

app.use("/authors", authorRouter);
// app.use("/books", bookRouter);
// app.use("/", indexRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`My first Express app - listening port ${PORT}!`);
});

