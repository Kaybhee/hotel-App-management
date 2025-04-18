import mongoose from 'mongoose'


const hotelSchema = mongoose.Schema({
    name: {
    type: String,
    required: true,
    },
    hotelType: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    distance: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: false,
    },
    desc: {
        type: String,
        required: true,
    },
    ratings: {
        type: String,
        min: 0,
        max: 5   
    },
    rooms: {
        type: [String],
        required: true,
    },
    cheapestRooms: {
        type: Number,
        required: true,
    }



})



const Hotels = mongoose.model("Hotel", hotelSchema)
export default Hotels