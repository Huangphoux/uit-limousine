import { Router } from 'express';
import {
  applyInstructor,
  approveApplication,
  rejectApplication,
  getAllApplications,
  getApplicationById
} from '../controllers/instructor/instructor-application.controller.js';

const router = Router();
router.post('/apply', (req, res) => {
  applyInstructor(req, res);
});
router.get('/applications', (req, res) => {
  getAllApplications(req, res);
});
router.get('/applications/:applicationId', (req, res) => {
  getApplicationById(req, res);
});
router.post('/applications/:applicationId/approve', (req, res) => {
  approveApplication(req, res);
});
router.post('/applications/:applicationId/reject', (req, res) => {
  rejectApplication(req, res);
});
export default router;