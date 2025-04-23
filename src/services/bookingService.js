const axios = require('axios');
const { BookingRepository } = require('../repositories')
const db = require('../models');
const { ServerConfig } = require('../config');
const AppError = require('../utils/error/appError');
const { StatusCodes } = require('http-status-codes');
const bookingRepository = new BookingRepository();
const { ENUMS } = require('../utils/common');
const { BOOKED, CANCELLED, INITIATED, PENDING } = ENUMS.BOOKING_STATUS;

const createBooking = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {

        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        if (data.noOfSeats > flightData.totalSeats) {
            throw new AppError('Requested number of seats are not available.', StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount = data.noOfSeats * flightData.price;
        // console.log(totalBillingAmount);
        const bookingPayload = { ...data, totalCost: totalBillingAmount };
        console.log("Booking Payload: ", bookingPayload);
        const booking = await bookingRepository.create(bookingPayload, transaction);

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noOfSeats
        })

        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const makePayment = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {
        // console.log("inside make payment booking service");
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        if (bookingDetails.status == CANCELLED) {
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }
        // console.log("data on service",data);
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if (currentTime - bookingTime > 300000) {
            await cancelBooking(data.bookingId);
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }
        if (bookingDetails.totalCost != data.totalCost) {
            throw new AppError('The amount of the payment entered does not match', StatusCodes.BAD_REQUEST);
        }

        if (bookingDetails.userId != data.userId) {
            throw new AppError('The user corresponding to the booking does not match', StatusCodes.BAD_REQUEST);
        }
        // assuming payment is successfully
        const response = await bookingRepository.update(data.bookingId, { status: BOOKED }, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const cancelBooking = async (bookingId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId, transaction);
        if (bookingDetails.status == CANCELLED) {
            await transaction.commit();
            return true;
        }

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
            seats: bookingDetails.noOfSeats,
            dec: 0
        });

        await bookingRepository.update(bookingId, { status: CANCELLED }, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const cancelOldBookings=async()=>{
    try{
        const time=new Date(Date.now()-1000*300); //5 minutes ago time
        const response=await bookingRepository.cancelOldBookings(time);
        return response;
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelBooking,
    cancelOldBookings
}