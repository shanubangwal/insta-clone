import express, { urlencoded } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import { app,server} from './sockets/socket.js';

import path from "path";

dotenv.config({});

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
console.log(__dirname)


// middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: process.env.URL ,
  credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));

// routes api here
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);
// app.use('/api/v1/user/register', userRoute);

app.use(express.static(path.join(__dirname,"/frontend/dist")));
app.get("*",(req,res)=>(
  res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
))

// "http://localhost:8000/api/v1/user/register"

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
// app.use(cors());