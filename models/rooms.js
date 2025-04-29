import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
    title: {
      type:String,
      required: true,
      unique: true
    },
    price: {
        type: Number,
        required: true
        },
    maxPeople: {
        type: Number,
        required: true
        },
    desc: {
        type: String,
        required: true,
        // select: false,
      },
      roomNumbers: [{number: Number, unavailableDate: {type: [Date]}}]
    }, {timestamps: true}
)
const Room = mongoose.model("Room", roomSchema);
export default Room;