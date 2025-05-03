import bcrypt from 'bcryptjs';
import { UserRole } from '../generated/prisma/index.js';
import {db} from '../libs/db.js';
import jwt from 'jsonwebtoken';
export const register = async(req,res)=>{
const {email,password,name}=req.body;
try{
 const existingUser = await db.user.findUnique({
where:{
               email
}               
 })
 if(existingUser){
               return res.status(400).json({
                              error:"User already exists"
               })
 }
 const hashPassword = await bcrypt.hash(password,10);
 const newUSer = await db.user.create({
               data:{
                              email,
                              password:hashPassword,
                              name,
                              role:UserRole.USER
               }
 })

 const token = jwt.sign({id:newUSer.id},process.env.JWT_SECRET,{
               expiresIn:"7d"
 })
 res.cookie("jwt",token,{
               httponly:true,
               sameSite:"strict",
               secure:process.env.NODE_ENV !=="development",
               maxAge:1000*60*60*24*7
 })
 res.status(201).json({
               message:"User created successfully",
               user:{
                              id:newUser.id,
                              email:newUser.email,
                              name:newUsername,
                              role:newUSer.role,
                              image:newUser.image
               }
 })
}catch(error){
               console.log("error creating user",error);
               res.status(500).json({
                              error:"Error creating user "
               })

}
}
export const login = async(req,res)=>{

}
export const logout = async(req,res)=>{

}
export const check = async(req,res)=>{

}