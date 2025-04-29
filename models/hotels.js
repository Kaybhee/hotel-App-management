import mongoose from 'mongoose'


const hotelSchema = mongoose.Schema({
    // firstname: {
    // type: String,
    // required: true,
    // },
    // lastName: {
    //     type: String,
    //     required: true,
    //     },
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
    available: {
        type: Boolean,
        default: true
    },
    cheapestRooms: {
        type: Number,
        required: true,
    },
    rooms: {
        type: [String]
    }
})



const Hotels = mongoose.model("Hotel", hotelSchema)
export default Hotels