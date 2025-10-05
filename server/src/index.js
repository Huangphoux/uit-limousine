import express from "express";
import dotenv from "dotenv";
import passport from "passport"
import session from "express-session"
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Listening to http://localhost:${PORT}`);
});