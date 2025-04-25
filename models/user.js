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
      }, {timestamps: true}
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")){
    return next()
  }
    this.password = await encryptPass(this.password)
    next()
})
const User = mongoose.model("User", userSchema);
export default User;