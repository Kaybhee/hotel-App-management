import mongoose from 'mongoose';
import encryptPass from '../encrypt.js';

const userSchema = mongoose.Schema({
    userName: {
      type:String,
      required: true,
      unique: true
    },
    email: {
        type: String,
        required: true
        },
    password: {
        type: String,
        // select: false,
        required: [true, "Please provide a password"],
        minlength: [8, "Password must be at least 8 characters"],
        match: [
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
          "Password must contain at least one digit, one lowercase, one uppercase, and one special character",
        ]
      },
        isAdmin: {
          type: Boolean,
          default: false
        },
        isVerified: {
          type: Boolean,
          default: false
        }
      }, {timestamps: true}
)
const User = mongoose.model("User", userSchema);
export default User;