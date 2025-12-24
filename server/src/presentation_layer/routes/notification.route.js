// server/src/presentation_layer/routes/notification.route.js

import express from "express";
import { NotificationController } from "../controllers/notification/notification.controller.js";

const router = express.Router();
const notificationController = new NotificationController();

import { authenticationMiddleware } from "../middlewares/authentication.middleware.js";

// Protected routes - use real authentication middleware which populates req.user
router.use(authenticationMiddleware);

// Create notification
router.post("/", (req, res) => notificationController.createNotification(req, res));

// Get unread count (should be before /:id to avoid conflict)
router.get("/unread-count", (req, res) => notificationController.getUnreadCount(req, res));

// Mark all as read
router.put("/read-all", (req, res) => notificationController.markAllAsRead(req, res));

// Get all notifications for current user
router.get("/", (req, res) => notificationController.getUserNotifications(req, res));

// Get notification by ID
router.get("/:id", (req, res) => notificationController.getNotificationById(req, res));

// Mark notification as read
router.put("/:id/read", (req, res) => notificationController.markAsRead(req, res));

// Delete notification
router.delete("/:id", (req, res) => notificationController.deleteNotification(req, res));

export default router;
