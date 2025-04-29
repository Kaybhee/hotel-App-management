import User from '../models/user.js'
import errorHandler from '../middlewares/errors/errHandling.js'


export const updateUser = async(req, res, next) => {
    const { userId } = req.params
    // const upHotels = new Hotels(req.body)
    console.log("Request Params:", req.params); // Log the entire req.params object
    console.log("User ID:", userId);
    try {
        const findUser = await User.findById(userId)
        if (!findUser) {
            return next(errorHandler(400, "User does not exist"))
        }
        if (req.body.email) {
            return next(errorHandler(400, "User email cannot be updated"))
        }
        if (req.body.password) {
            const hashed = await bcrypt.hash(req.body.password, 10)
            findUser.password = hashed
        }
        findUser.userName = req.body.userName || findUser.userName
        findUser.password = req.body.password || findUser.password
        await findUser.save()
        console.log(findUser)
        const { password: _, ...upDatedUser } = findUser._doc
        return res.status(200).json({
            message: "Updated successfully",
            data: upDatedUser
        })
    } catch (err) {
        console.error({error: "Error", err})
        return next(err)
    }
}


export const getUsers = async(req, res, next) => {
    try {
        const getUsers =await User.find()
        if (!getUsers) {
            return next(errorHandler(400,"No Users found"))
        } 
        const excludePass = [];
            for (let i = 0; i < getUsers.length; i++) {
                const { password: pass, ...userData } = getUsers[i]._doc
            excludePass.push(userData)
        }
            
            return res.status(200).json({
                message: "Users successfully retrieved", excludePass})
    } catch (err) {
        console.log({error: "Error", err}) // Log all errors
        next(err)
}
}
export const getUser = async(req, res) => {
    const { userId } = req.params
    try {
        const getUser = await User.findById(userId)
        if (!getUser) {
            return res.status(400).json({message: "User does not exist"})
        }
        // Destructuring password
        const { password: pass, ...userData } = getUser._doc
            return res.status(200).json({message: "User successfully retrieved", userData})
    } catch (err) {
        next(err)
    }
}

export const delUser = async(req, res) => {
    const { userId } = req.params
    try {
        const deleteUser = await User.findByIdAndDelete(userId)
        if (!deleteUser) {
            return res.status(400).json({message: "User does not exist"})
        } const { password: _, ...delPass } = deleteUser._doc
            return res.status(200).json({message: "User successfully deleted", deleteUser})
    } catch (err) {
        return next(err)
    }
}
