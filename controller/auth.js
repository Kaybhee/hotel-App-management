import User from '../models/user.js'
import NodeCache from 'node-cache';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errorHandler from '../middlewares/errors/errHandling.js'
import { JWT_SECRET, ADMIN_SECRET } from '../app.js'
import { sendEmail } from '../services/mail.js';
import { configDotenv } from 'dotenv';

const cache = new NodeCache()

export const register = async(req, res, next) => {
    const { userName, email, password, isAdmin, adminKey } = req.body;
    const rePass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/
    try {
        if (!userName || !email || !password) {
            return next(errorHandler(400, "Please fill in all fields"));
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return next(errorHandler(400, "Email already exists"));
        }
        if (password.length < 8) {
            return next(errorHandler(400, "Password must be at least 8 characters"))
        }

        const existingUserName = await User.findOne({ userName });

    if (existingUserName) {
      return next(errorHandler(400, "Username already exists"));
    }

        if (!rePass.test(password)) {
            return next(errorHandler(400, "Password must contain at least one digit, one lowercase, one uppercase, and one special character"))
        }

        let isAdminFlag = false;
        if (adminKey && adminKey === ADMIN_SECRET ) {
            isAdminFlag = true;
        } else if (isAdmin) {
            return next(errorHandler(403, "Invalid admin key"))
        }
            const hash = await bcrypt.hash(password, 10);
            const user = await User.create({
                userName, email, password: hash,
                isAdmin: isAdminFlag
            })
            // cache code and send to user
            let code = null
            if (!user.isVerified && !user.isAdmin) {
                const code = Math.floor(100000 + Math.random() * 900000);
            cache.set(email, code.toString(), 3600000);
            const sendingEmail = await sendEmail(email, {
                subject: "Account verification",
                message: `Your verification code is ${code}`
            });
            if (!sendingEmail) {
                return next(errorHandler(500, "Error sending email"))
            }
            return next(
                errorHandler(400, 'User not verified. OTP sent to email for verification')
              );

            }

            let token = null;
            if (isAdminFlag) {
                token = jwt.sign({id: user._id, isAdmin: true }, ADMIN_SECRET, {
                    expiresIn: '30d'
                })
            }
           
            const { password: _, ...userData } = user._doc
            res.status(200).json({
                message: "User created successfully",
                token: token ? `Bearer ${token}` : null,
                user: userData,
                ...(code && { code })
            })
    } catch (error) {
        next(error)
    }
}

export async function resendUserOtp(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({
        email: email,
      });
      if (!user) {
        return next(errorHandler("User not found"));
      }
      const code = Math.floor(100000 + Math.random() * 900000);
      cache.set(email, code.toString(), 3600000);
      const sendingEmail = await sendEmail(email, {
        subject: "Account Verification",
        message: `Your verification code is ${code}`,
      });
      if (!sendingEmail) {
        return res
          .status(500)
          .json({ status: false, message: "Error sending email", data: null });
      }
      return res.status(200).json({
        status: true,
        message: "OTP sent",
        data: { code },
      });
    } catch (err) {
      next(err)
    }
  }
  

  export const verifyUserRegistration = async(req, res, next) => {
    try {
      const { email, code } = req.body;
      const verificationCode = cache.get(email);
      if (verificationCode !== code.toString()) {
        return next(errorHandler(400,"Invalid verification code"));
      } else {
        const user = await User.findOne({ email: email });
        if (!user) {
          return next(errorHandler("User not found"));
        } else {
          user.isVerified = true;
          const savedUser = await user.save();
          const genToken = jwt.sign({id: savedUser._id}, JWT_SECRET, {
            expiresIn: '1h'
        })
        if (!genToken) {
            return next(errorHandler(400, "Token not generated")) 
        }
        return res.status(200).json({message: "User verified", token: `Bearer ${genToken}`})
    }
 }
 } catch (err) {
      next(err)
    }
  }
  
export const userLogin = async(req, res, next) => {
    const { email, password } = req.body;
    try {
        const userCred = await User.findOne({email})
        if (!userCred) {
            return next(errorHandler(400,"User not found"))
        }
        const isPassword = await bcrypt.compare(password, userCred.password);
        if (!isPassword) {
            return next(errorHandler(400, "Invalid Credentials")) 
        }
        
            if (!userCred.isVerified) {
              // send otp
              const code = Math.floor(100000 + Math.random() * 900000);
              cache.set(email, code.toString(), 3600000);
              const sendEmail = await sendEmail(email, {
                subject: "Account Verification",
                message: `Your verification code is ${code}`,
              });
              if (!sendEmail) {
                return next(errorHandler("Error sending email"));
              }
              return next(errorHandler("User not verified. OTP sent to email for verification"));
            } else {
                const genToken = jwt.sign({id: userCred._id}, JWT_SECRET, {
                    expiresIn: '1h'
                })
                if (!genToken) {
                    return next(errorHandler(400, "Token not generated")) 
                }
                return res.status(200).json({message: "User logged in successfully", token: `Bearer ${genToken}`})
            }
            } catch (err) {
            next(err)
          }
        }


export const adminLogin = async(req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email})
    if (!user) {
      return next(errorHandler(404, "User not found"))
    }
    const isPass = await bcrypt.compare(password, user.password);
    if (!user.isAdmin) {
      return next(errorHandler(403, "Access denied"))
    }
    if (!user || !isPass) {
      return next(errorHandler(400, "Try again, Password is incorrect"))
    }
    return res.status(200).json({
      message: "Admin Logged in successfully"
    })
  } catch (err) {
    next(err)
  }
}