const { StatusCodes } = require("http-status-codes");
const {BookingService}=require("../services");
const {SuccessResponse,ErrorResponse}=require('../utils/common');

const createBooking=async(req,res)=>{
    try{
        console.log("Inside booking controller");
        console.log("body: ",req.body);
        const response=await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        });
        console.log(response);
        SuccessResponse.data=response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }catch(error){
        console.log("Inside controller erorr: ",error.message)
        ErrorResponse.error=error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports={
    createBooking
}