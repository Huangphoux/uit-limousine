import express from "express";
import cors from "cors";
import authRouter from './presentation_layer/routes/auth.route.js';
import coursesRouter from './presentation_layer/routes/courses.route.js';
import notificationRouter from './presentation_layer/routes/notification.route.js';


const app = express();
app.use(cors({ origin: ['https://uit-limousine.netlify.app', 'http://localhost:5173'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/courses', coursesRouter);

export default app;