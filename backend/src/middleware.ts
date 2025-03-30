import { NextFunction,Request,Response } from "express";
import jwt from 'jsonwebtoken'
import { jwt_pass } from './config';

export const userMiddleware= (req:Request,res:Response,next:NextFunction)=>{
    const headers=req.headers["authorization"];
    const decoded=jwt.verify(headers as string , jwt_pass); // headers as string
     if(decoded)
     {
        // @ts-ignore
        req.userId=decoded.id;
        next();
     }
     else {
    res.status(403).json({
        message : "You are not signed in "
    })
     }


};