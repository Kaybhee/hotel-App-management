import User from '../models/user.js'
import NodeCache from 'node-cache';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errorHandler from '../middlewares/errors/errHandling.js'
import { JWT_SECRET, ADMIN_SECRET } from '../app.js'
import { sendEmail } from '../services/mail.js';

const cache = new NodeCache()

export const register = async(req, res, next) => {
    const { userName, email, password, isAdmin, adminKey } = req.body;
    const rePass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/
    try {
        if (!userName || !email || !password) {
            return next(errorHandler(400, "Please fill in all fields"));
        }
        const existingUser = await User.findOne({$or: [{email : email}, {username : userName}]});
        if (existingUser) {
            return next(errorHandler(400, "Email or username already exists"));
        }
        
        if (password.length < 8) {
            return next(errorHandler(400, "Password must be at least 8 characters"))
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
        if (!user.isVerified && !user.isAdmin) {
          // const code = Math.floor(100000 + Math.random() * 900000);
          // cache.set(email, code.toString(), 3600000);
          const token = jwt.sign( {email : user.email}, process.env.VERIFICATION_SECRET, { expiresIn : "10m"})

          const verification_link = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;
          const sendingEmail = await sendEmail(user.email, {
            subject: "Account verification",
            message: `<p> Please verify your email by clicking the link below: </p>
            <a href=${verification_link}> Verification Email</a> 
            <p> style="display:inline-block;padding:12px 20px;
   background:#2563eb;color:white;text-decoration:none;
   border-radius:6px; </p>`
          });
          
          if (!sendingEmail) {
            return next(errorHandler(500, "Error sending email"))
          }
          return res.status(201).json({
          message: 'Account created. Check your email for verification',
        })
        }

        if (isAdminFlag) {
            token = jwt.sign({id: user._id, isAdmin: true }, ADMIN_SECRET, {
                expiresIn: '30d'
            })
        }
        
        res.status(200).json({
            message: "This user has all Admin privilege"
          })
        } catch (error) {
          next(error)
        }
      }


export async function resendUserLink(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({
        email: email,
      });

      if (!user) {
        return next(errorHandler("User not found"));
      }
      // const code = Math.floor(100000 + Math.random() * 900000);
      // cache.set(email, code.toString(), 3600000);
      const token = jwt.sign( {email : user}, process.env.VERIFICATION_SECRET, { expiresIn : "10m"})
      
      const verification_link = `${process.env.APP_URL}/verify-email?token=${token}`;
      const sendingEmail = await sendEmail(user.email, {
        subject: "Account verification",
        message: `<p> Please verify your email by clicking the link below: </>
        <button style="color: blue; height=50px; width:100px"><a href=${verification_link}> Verification Email</a> 
        <p>This verification link expires in 10 minutes </p>`
      });
          
      // const sendingEmail = await sendEmail(email, {
      //   subject: "Account Verification",
      //   message: `Your verification code is ${code}`,
      // });
      if (!sendingEmail) {
        return res
          .status(500)
          .json({ status: false, message: "Error sending email", data: null });
      }
      return res.status(200).json({
        status: true,
        message: "Verification link sent",
        // data: { code },
      });
    } catch (err) {
      next(err)
    }
  }
  

  export const verifyUserRegistration = async(req, res, next) => {
    try {
      const { token } = req.body;
      // const verificationCode = cache.get(email);

      // if (verificationCode !== code.toString()) {
      //   return next(errorHandler(400,"Invalid verification code"));
      if (!token) 
        {return "Verification token missing"}
      
      const decoded = jwt.verify(token, process.env.VERIFICATION_SECRET)
      const user = await User.findOne({email : decoded.email })
      if (!user) 
        return res.status(404).json({message: "User not found"})
      if (user.isVerified)
        return res.status(200).json({message:"User already verified" })
      user.isVerified = true
      await user.save()
      return res.status(200).json({ message: "User verified successfully"})
    }
    catch (err) {
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
              // const code = Math.floor(100000 + Math.random() * 900000);
              // cache.set(email, code.toString(), 3600000);
              const token = jwt.sign( {email : userCred}, process.env.VERIFICATION_SECRET, { expiresIn : "10m"})
      
              const verification_link = `${process.env.APP_URL}/verify-email?token=${token}`;
              const sendingEmail = await sendEmail(user.email, {
                subject: "Account verification",
                message: `<p> Please verify your email by clicking the link below: </>
                <button style="color: blue; height=50px; width:100px"><a href=${verification_link}> Verification Email</a> 
                <p>This verification link expires in 10 minutes </p>`
              });
              if (!sendingEmail) {
                return next(errorHandler("Error sending email"));
              }
              return next(errorHandler("Verification email sent"));
            } else {
                const genToken = jwt.sign({id: userCred._id}, JWT_SECRET, {
                    expiresIn: '1h'
                })
                if (!genToken) {
                    return next(errorHandler(400, "Token not generated")) 
                }
                // destructuring password
                const { password: _, ...userData } = userCred._doc
                return res.status(200).json({message: "User logged in successfully", data: userData, token: `Bearer ${genToken}`})
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