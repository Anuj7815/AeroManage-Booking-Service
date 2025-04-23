const { StatusCodes } = require("http-status-codes");
const {BookingService}=require("../services");
const {SuccessResponse,ErrorResponse}=require('../utils/common');
const inMemDb = {};

const createBooking=async(req,res)=>{
    try{
        // console.log("Inside booking controller");
        // console.log("body: ",req.body);
        const response=await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        });
        console.log(response);
        SuccessResponse.data=response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }catch(error){
        // console.log("Inside controller erorr: ",error.message)
        ErrorResponse.error=error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

const makePayment=async(req,res)=>{
    try{
        const idempotencyKey = req.headers['x-idempotency-key'];
        if(!idempotencyKey ) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: 'Idempotency key missing'});
        }
        if(inMemDb[idempotencyKey]) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: 'Cannot retry on a successful payment'});
        } 
        // console.log("inside...",req.body);
        // console.log("Totalcost: ",req.body.totalCost);
        const response=await BookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId
        });
        inMemDb[idempotencyKey] = idempotencyKey;
        // console.log(response);
        SuccessResponse.data=response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }catch(error){
        console.log("Inside controller erorr make payment: ",error.message)
        ErrorResponse.error=error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports={
    createBooking,
    makePayment
}