import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { userModel, contentModel, linkModel } from './db';
import { JWTSECRET} from './config';
import { userMiddleware } from './middlewares';
import { Random } from './utils';
import cors from "cors";


const app=express();
app.use(express.json());


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.post("/api/v1/signup", async (req, res) => { 
    const userName = req.body.userName;
    const password = req.body.password;

    try {
        await userModel.create({
            userName,
            password
        });

        res.json({
            message: "Signup successful!"
        });
    } catch (error) {
       
            res.status(400).json({
                message: "User already exists!"
            });
        
    }
});



app.post('/api/v1/login', async(req,res) => {

    const userName = req.body.userName;
    const password = req.body.password;

    const existingUser = await userModel.findOne({
        userName:userName,
        password:password
    });

    if(existingUser)
    {
        const token = jwt.sign({
            id: existingUser._id
        },JWTSECRET);

        res.json({
            token
        })

    }
    else{
        res.status(403).json({
            message: "Invalid Credentials!"
        });
    }


});

app.post('/api/v1/createContent', userMiddleware,async (req,res) => {

     const type=req.body.type;
     const link=req.body.link;

     await contentModel.create({
        link, 
        type,
        title: req.body.title,
        //@ts-ignore
        userId: req.userId,
        tags: []
     })

     res.json({
        message:"Content Added Sucessfully!"
     });
   

});

app.get('/api/v1/viewContent', userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const content = await contentModel.find({ userId }).populate('userId', 'userName');

  res.json({ content });
});


app.delete("/api/v1/deleteContent", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  try {
    await contentModel.deleteOne({
      contentId,
      // @ts-ignore
      userId: req.userId,
    });

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Deletion failed" });
  }
});


app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;

    if (share) {
        const existingLink = await linkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });

        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }

        const hash = Random(17);
        await linkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        });

        res.json({
           message: hash
        });
    } else {
        await linkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });

        res.json({
            message: "Shareable link is removed!"
        });
    }
});


app.get("/api/v1/brain/:sharelink", async (req,res)=>{

    const hash = req.params.sharelink;

    const link = await linkModel.findOne({
         hash
    });

    if(!link)
    {
        res.status(411).json({
            message:"Sorry Incoorect Input!"
        });
        return
    }
  
        const content = await contentModel.find({
        userId: link.userId
        });
    

    const user = await userModel.findOne({
            _id : link?.userId
    })

    if(!user)
    {
        res.send(411).json({
            message: "User Not Found!"
        })
        return;
    }

    res.json({
        userName: user.userName,
        content: content
    })
    
})



app.listen(3000);
console.log("The Server is Running On The Port 3000");
