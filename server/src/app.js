import express from "express";
import cors from "cors";
import authRouter from './presentation_layer/routes/auth.route.js';
import coursesRouter from './presentation_layer/routes/courses.route.js';
import lessonRouter from './presentation_layer/routes/lessons.router.js';
import notificationRouter from './presentation_layer/routes/notification.route.js';
import gradeRouter from './presentation_layer/routes/grade.route.js'; 
import instructorRouter from './presentation_layer/routes/instructor.route.js';


const app = express();
app.use(cors({ origin: ['https://uit-limousine.netlify.app', 'http://localhost:5173'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/courses', coursesRouter);
app.use('/lessons', lessonRouter);
app.use('/notifications', notificationRouter);
app.use('/grade', gradeRouter);
app.use('/instructor', instructorRouter);
export default app;