import { Router } from 'express';
import { gradeSubmission } from '../controllers/grade/grade.controller.js';

const router = Router();
router.post('/submissions/:submissionId', (req, res) => {
      gradeSubmission(req, res);
});


export default router;