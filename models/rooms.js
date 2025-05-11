import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
    title: {
      type:String,
      required: true,
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
      roomNumbers: [{
        number: {type: Number, required: true},
        unavailableDates: {type: [Date], default: []}
      }
    ]
    }, {timestamps: true}
)
const Room = mongoose.model("Room", roomSchema);
export default Room;