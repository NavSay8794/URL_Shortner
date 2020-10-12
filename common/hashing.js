const bcrypt = require('bcrypt')

let hashing = async (password)=>{
    //generate salt
    let salt = await bcrypt.genSalt(10);
    //hashing the password
    let hash = await bcrypt.hash(password, salt)
    return hash
}

module.exports = {hashing}