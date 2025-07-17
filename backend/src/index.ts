import express from 'express' // export default
//normal export means you have to destructure
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { userModel } from './db';
import { contentModel } from './db';
import cors from 'cors';
import { linkModel } from './db';
import { userMiddleware } from './middleware';
const app=express();
import {random} from 'secrets.js-grempe';
import { jwt_pass } from './config';
import { ParameterDeclaration } from 'typescript';
import axios from 'axios';

app.use(cors());
app.use(express.json()); // export the entire thing, we need to import the specific by destructuring

app.get("/",(req,res)=>{
    console.log("hdded");
    res.json({});
});

app.post("/api/v1/signup",async (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const userExists=await userModel.findOne({username});
    if(userExists)
    {
        res.status(411).send({
            message : "The username already exists/you are registered already"
        })
    }
    else {
        await userModel.create({
            username:username,
            password:password
        });
        res.json({
            message : "success"
        })

    }

    
   
   
});

app.post("/api/v1/signin",async (req,res)=>{
    const username=req.body.username;
    const response=await userModel.findOne({username});
    if(!response)
    {
        res.status(403).json({
            message : "Incorrect credentials"
        });
    }
    else {
        const token=jwt.sign({
            id:response._id
        },jwt_pass);
        res.json({token});
    }
  
    
    
});

app.delete("/api/v1/delete/:title/:link",userMiddleware,async (req,res)=>{
    const contentTitle=req.params.title;
    const contentLink=req.params.link;

    const response=await contentModel.deleteMany({
        title:contentTitle,
        link:contentLink,
        //@ts-ignore
        userId:req.userId
    });
    console.log(response);
    if(response)
    {
        res.json({
            message : "success"
        })
    }
    else {
        res.json({
            message : response
        })
    }
});

app.post("/api/v1/content",userMiddleware,async (req,res)=>{ // userId comes from the middleware..
    const title=req.body.title;
    const link=req.body.link;
    const type=req.body.type;
    const tags=Array.isArray(req.body.tags) ? req.body.tags : [];
    await contentModel.create({
        title:title,
        link:link,
        type:type,
        //@ts-ignore
        userId:req.userId,
        tags:tags
    });
    res.json({
        message : "content added"
    })
    
});


app.get("/api/v1/content",userMiddleware,async (req,res)=>{
    //@ts-ignore
      const link=req.userId;
      const content=await contentModel.find({userId:link}).populate("userId","username");
      res.json({  // get the content with this userId..also get(populate) the userId means get all the details of user with this userId, but you don't want the password..only username you want..so write ,"username"
         content
      });
});

app.post("/api/v1/share",userMiddleware,async (req,res)=>{
    let share=req.body.share;
     //@ts-ignore
    const hash=random(15);
    if(share)
    {
            await linkModel.create({
                //@ts-ignore
                userId:req.userId,
                link:hash,
    
            });
       res.json({
        message : "link is "+hash
       })
        }      
    
    else {

         await linkModel.deleteOne({
            //@ts-ignore
                userId:req.userId
                
            });
            res.json({
                message : "Link has been deleted"
            })
    }
    res.json({});
});



app.get("/api/v1/brain/:shareLink",async (req,res)=>{

    const shareLink=req.params.shareLink;
     const content=await linkModel.findOne({link:shareLink});
     if(content)
     {
        let userId=content.userId;
       let data= await contentModel.find({userId:userId});
       if(data)
       {
        res.json({data});
       }
       else {
        res.json({
            message : "nothing to see"
        })
       }

     }
     else {
        res.json({
            message : "link is invalid"
        })
     }

});

app.post("/api/v1/summarize", userMiddleware, async (req, res) => {
    const topic = req.body.topic;
    if (!topic) {
        res.status(400).json({ message: "Topic is required" });
        return;
    }
    try {
        //@ts-ignore
        const userId = req.userId;
        const posts = await contentModel.find({
            userId,
            $or: [
                { title: { $regex: topic, $options: 'i' } },
                { type: { $regex: topic, $options: 'i' } }
            ]
        });
        if (!posts.length) {
            res.status(404).json({ message: "No posts found for this topic" });
            return;
        }
        const text = posts.map(post => `Title: ${post.title}\nType: ${post.type}\nLink: ${post.link}`).join("\n\n");
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            res.status(500).json({ message: "Gemini API key not set" });
            return;
        }
        const geminiRes = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
            {
                contents: [{ parts: [{ text: `Summarize the following posts about '${topic}':\n${text}` }] }]
            }
        );
        const summary = (geminiRes.data as any).candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
        res.json({ summary });
    } catch (e: any) {
        res.status(500).json({ message: "Failed to summarize posts", error: e.message });
    }
});

app.listen(3001);




