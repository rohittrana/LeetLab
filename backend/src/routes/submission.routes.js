import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {getAllSubmission,getAllTheSubmissionsForProblem,getAllSubmission} from '../controllers/submission.controller.js'

const submissionRoutes = express.Router()

submissionRoutes.get('/get-all-submissions',authMiddleware,getAllSubmission);
submissionRoutes.get('/get-submission/:problemId',authMiddleware,getSubmissionsForProblem)

submissionRoutes.get('/get-submission-count/:problemId',authMiddleware,getAllTheSubmissionsForProblem)


export default submissionRoutes;
