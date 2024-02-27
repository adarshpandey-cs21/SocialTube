import dotenv from 'dotenv';
import connectDB from './db/index.js';
import {app} from './app.js';

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server started sucessfully at Port ${process.env.PORT||8000}`);
    })
})
.catch((err)=>console.log(err));











/*
import express from "express";
const app=express();
;(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

       app.on("error",(error)=>{
        console.log(error);
        throw error;
       })

       app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
       })
    } catch (error) {
        console.error(error+ " -----Error in DB connection");
        throw error;
    }
})()
*/