const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const PORT=process.env.PORT;
const { Queue}=require('./config');
const apiRoutes=require('./routes');
const CRON=require('./utils/common/cronJobs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api',apiRoutes);

app.listen(PORT,async()=>{
    console.log("Server is Running on PORT: ",PORT);
    CRON();
    await Queue.connectQueue();
    console.log("queue connected");
});

