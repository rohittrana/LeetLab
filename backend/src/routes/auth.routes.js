import express from 'express';
const authRoutes = express.Router();
import {authMiddleware} from '../middleware/auth.middleware.js'
import {login ,register , check ,logout} from '../controllers/auth.controller.js';

authRoutes.post('/register',register);
authRoutes.post('/login',login);
authRoutes.post('/logout',authMiddleware,logout);
authRoutes.get('/check',authMiddleware,check);
export default authRoutes;