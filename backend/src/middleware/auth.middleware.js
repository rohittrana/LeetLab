import jwt from 'jsonwebtoken';
import {db} from '../libs/db.js';

export const authMiddleware = async(req,res,next)=>{
     try{
       const token = req.cookies.jwt;
       if(!token){
               return res.status(401).json({
                              message:"Unauthorized No token provided"
               })
               
       }
       let decoded;

       try{
       decoded = jwt.verify(token,process.env.JWT_SECRET);        
       }
       catch(error){
               return res.status(401).json({
                              message:"Unauthorized -Invalid token"
               })
             
       }
       const user = await  db.user.findUnique({
               where:{
                              id:decoded.id
               },
               select:{
                              id:true,
                              image:true,
                              name:true,
                              email:true,
                              role:true
               }
       })
       if(!user){
               return res.status(404).json({
                              message:"user is not found"
               })
       }
       req.user = user;
       next();
     }
     catch(error){
         console.log('error user not found checkpoint',error);
         res.status(500).json({
               message:"Error authenticating user"
         }
         )
     }
}

export const  checkAdmin = async(req,res,next)=>{
        try{
           const userId = req.body;
           const user = await db.user.findUnique({
                where:{
                        id:userId
                },
                select:{
                        role:true,

                }
           })
           if(!user || user.role !==user.role.ADMIN){
                return res.status(403).json({
                        message:"Forebidden - You Do not have permission to access this code "
                })
           }
           next();
        }
        catch(error){
                console.log('error message' ,error);
                return res.status(500).json({
                        message:"incorrect creadentials"
                })
        }
}