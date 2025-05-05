import express from'express'
import { authMiddleware,checkAdmin } from '../middleware/auth.middleware.js'
import {createProblem , getAllProblems,getProblemById,updateProblem,deleteProblem,getAllProblemsSolvedByUser  } from '../controllers/problem.controller.js';
import { check } from '../controllers/auth.controller.js';

const problemRotues = express.Router();

problemRotues.post('/create-problem',authMiddleware,checkAdmin,createProblem)
problemRotues.get('/get-all-problem',authMiddleware,getAllProblems);
problemRotues.get('/get-problem/:id',authMiddleware,getProblemById);
problemRotues.put("/update-problem/:id",authMiddleware,checkAdmin,updateProblem);

problemRotues.delete('/delete-problem/:id',authMiddleware,checkAdmin,deleteProblem);

problemRotues.get('/get-solved-problems',authMiddleware,getAllProblemsSolvedByUser);
export default problemRotues;