import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
// all Routes import 
import authRoutes from './routes/auth.route.js'
const app= express();
app.use(express.json());
app.use(cookieParser());
app.get('/',(req,res)=>{
               res.send({
                              msg:"Welcome to the leetlab 🔥"
               })
})

app.use('/api/v1/auth',authRoutes);
app.listen(process.env.PORT,()=>{
               console.log('server is running on port 8080')
})