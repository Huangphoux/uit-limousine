import express from "express";
import cors from "cors";
import jsend from "jsend";
import authRouter from "./presentation_layer/routes/auth.route.js";
import coursesRouter from "./presentation_layer/routes/courses.route.js";
import lessonRouter from "./presentation_layer/routes/lessons.router.js";
import notificationRouter from "./presentation_layer/routes/notification.route.js";
import gradeRouter from "./presentation_layer/routes/grade.route.js";
import instructorRouter from "./presentation_layer/routes/instructor.route.js";
import adminRouter from "./presentation_layer/routes/admin.route.js";
import assignmentsRouter from "./presentation_layer/routes/assignments.route.js";

const app = express();
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? ["https://uit-limousine.onrender.com"] : true, // Allow all origins in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(jsend.middleware);

app.use("/auth", authRouter);
app.use("/courses", coursesRouter);
app.use("/lessons", lessonRouter);
app.use("/notifications", notificationRouter);
app.use("/grade", gradeRouter);
app.use("/instructor", instructorRouter);
app.use("/admin", adminRouter);
app.use("/assignments", assignmentsRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.jsend.success({ message: "UIT Limousine API is running!" });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).jsend.error({
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404,
  });
});

export default app;
