const dotenv=require('dotenv');
dotenv.config();

PORT=4000;
FLIGHT_SERVICE='http://192.168.29.193:3000'
module.exports={
    PORT: PORT,
    FLIGHT_SERVICE: FLIGHT_SERVICE
}