import express from "express";
import dotenv from "dotenv";
import authorRouter from "./routes/authorRouter.js";
// const bookRouter = require("./routes/bookRouter");
// const indexRouter = require("./routes/indexRouter");
import { Pool } from "pg";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use("/authors", authorRouter);
// app.use("/books", bookRouter);
// app.use("/", indexRouter);

app.get('/', async (req, res) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  const result = await client.query('SELECT version()');

  client.release();

  const { version } = result.rows[0];
  
  res.json({ version });
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Listening to http://localhost:${PORT}`);
});
