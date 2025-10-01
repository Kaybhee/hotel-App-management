import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    userName: {
      type:String,
      required: true,
      unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
        },
    password: {
        type: String,
        required: [true, "Please provide a password"]
      },
        isAdmin: {
          type: Boolean,
          default: false
        },
        isVerified: {
          type: Boolean,
          default: false
        },
        isDelete: {
          type: Boolean,
          default: false
        }
      }, {timestamps: true}
)
const User = mongoose.model("User", userSchema);
export default User;