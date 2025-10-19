import express from "express";
import cors from "cors";
import authRouter from './presentation_layer/routes/auth.route.js'

const app = express();
app.use(cors({ origin: ['https://uit-limousine.netlify.app', 'http://localhost:5173'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter)

export default app;