require('dotenv').config()

const jwt = require('jsonwebtoken')
const {mongoClient , dbUrl , dbname , ObjectId} = require('../config');


let authenticate = async (req,res,next) =>{
    let client;
    try {
        client = await mongoClient.connect(dbUrl);
        let db = client.db(dbname)
        console.log(req.headers)
        let user= await db.collection('users').findOne({_id:ObjectId(req.params.userId)})
        console.log(user)
        if(req.headers.authorization){
            await jwt.verify(req.headers.authorization, process.env.JWT_SECRET , (err , decode)=>{
                console.log(decode.id)
                if(decode){
                    if(decode.id == user._id){
                        next()
                    }else{
                        res.json({
                            message:'User not Authorized'
                        })
                    }
                }else{
                    res.json({
                        message:'Token Not Valid'
                    })
                }
            })
        }else{
            res.json({
                message: 'Token Not Present'
            })
        }
    } catch (error) {
        res.json({
            message:'Some Error Occurred'
        })
    }
}

module.exports = authenticate