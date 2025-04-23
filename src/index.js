const express=require('express');
const app=express();
const {ServerConfig, Queue}=require('./config');
const apiRoutes=require('./routes');
const CRON=require('./utils/common/cronJobs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api',apiRoutes);

app.listen(ServerConfig.PORT,async()=>{
    console.log("Server is Running on PORT: ",ServerConfig.PORT);
    CRON();
    await Queue.connectQueue();
    console.log("queue connected");
});

