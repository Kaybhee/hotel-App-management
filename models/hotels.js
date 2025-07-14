import mongoose from 'mongoose'


const hotelSchema = mongoose.Schema({
    hotelName: {
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
    title: {
        type: String,
        required: true,
    },
    ratings: {
        type: Number,
        min: 0,
        max: 5   
    },
    rooms: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Room'}],
    },
    cheapestRooms: {
        type: Number,
        required: true,
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    // rooms: {
    //     type: [String]
    // }
})



const Hotels = mongoose.model("Hotel", hotelSchema)
export default Hotels