import bcrypt from 'bcrypt';


const encryptPass = async(password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export default encryptPass