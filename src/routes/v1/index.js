const express=require('express');
const router=express.Router();
const {InfoController}=require('../../controllers');
const bookingRoute=require('./bookingRoute')

router.get('/info',InfoController.info);

router.use('/bookings',bookingRoute);

module.exports=router;
