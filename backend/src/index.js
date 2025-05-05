import express from 'express';
import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';
//all routes will come here
import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';
const port = process.env.PORT || 8080
dotenv.config('');
const app = express();

app.use(cookieParser());
app.use(express.json());
app.get('/',(req,res)=>{
               res.send("hey there")
})


app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/problem',problemRoutes);
app.listen(port,()=>{
               console.log('YOUR CODE IS RUNNNIG ON PORT 8080');
})