//require ('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:'./.env'
})

const port=process.env.PORT | 5000;

connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`server is running at :${port}`);
    })
})
.catch((err)=>{
    console.log("mongo db connection faild !!!",err);
})








// app.listen(port,()=>{
//     console.log(`server is running at :${port}`);
// })
/*
import express from "express"
const app=express();

;(async()=>{
    try {
       await mongoose.connect(`mongodb://127.0.0.1:27017/${DB_NAME}`);
       app.on("error",(error)=>{
        console.log("ERROR:-",error);
        throw error
       })
       app.listen(process.env.PORT,()=>{
        console.log(`app is listening on port ${process.env.PORT}`);
       })
    } catch (error) {
        console.log("ERROR :-",error);
        throw error
    }
})()
*/