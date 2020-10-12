require('dotenv').config()

var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//hashing
const hashing = require('../common/hashing')

const {mailOptions , transporter} = require('../common/mailing')
const { mongoClient, dbUrl, dbname, ObjectId } = require('../config');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// register
router.post('/register', async (req, res) => {
  let client;
  let isActive = false
  try {
    client = await mongoClient.connect(dbUrl)
    let db = client.db(dbname)
    
    //hashing the password
    req.body.password = await hashing.hashing(req.body.password)
        
    //generate a random 8digit id and assign to the user
    let randUid = Math.floor(Math.random()*(Math.pow(10,8)))
    
    let user = await db.collection('users').find().toArray()
    user.forEach(item =>{
      if(item.user_id == randUid){
        randUid = Math.floor(Math.random()*(Math.pow(10,8)))
      }
    })
    req.body.user_id = randUid
    req.body.isActive = isActive

    //stporing into db
    await db.collection('users').insertOne(req.body)
    
    //mail sending on register
    let user1 = await db.collection('users').findOne({email: req.body.email})
    mailOptions.to = req.body.email
    mailOptions.text = `<h1>Kindly click the link below to activate the account</h1>
    <p> http://localhost:3000/users/${user1._id}/activate`
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    client.close()
    res.json({
      message: ' User Created ',
      data: user1
    })
  } catch (error) {
    if (client) {
      client.close()
    }
    res.json({
      message: 'Some Error Occurred'
    })
  }
})


// login api
router.post('/login', async (req, res) => {
  let client;
  try {
    client = await mongoClient.connect(dbUrl)
    let db = client.db(dbname)

    let user = await db.collection('users').findOne({ email: req.body.email })
    console.log(user)
    if (user) {
      if (user.isActive == true) {
        let result = await bcrypt.compare(req.body.password, user.password)
        console.log(result)
        if (result) {
          let token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET)
          console.log(token)
          client.close()
          res.json({
            message: 'Success',
            token
          })
        } else {
          client.close()
          res.json({
            message: ' Email and Password mismatch'
          })
        }
      } else {
        if (client) {
          client.close()
          res.json({
            message: 'User Account Not Activated'
          })
        }
      }
    } else {
      client.close()
      res.status(404).json({
        message: 'User Not Found'
      })
    }
  } catch (error) {
    if (client) {
      client.close()
    }
    res.json({
      message: 'Some error occurred'
    })
  }
})

//user Activation
router.get('/:userId/activate' , async(req,res) =>{
  let client;
  try {
    client = await mongoClient.connect(dbUrl)
    let db = client.db(dbname)
    await db.collection('users').findOneAndUpdate({_id : ObjectId(req.params.userId)} , {$set: {isActive:true}})
    console.log('User Account Activated')
    client.close()
    res.json({
      message: 'User Account Activated'
    })
  } catch (error) {
    if(client){
      client.close()
    }
    res.json({
      message: 'Some Error Occurred'
    })
  }
})


//forgot password api

router.post('/forgot-password-verify-email' , async(req,res)=>{
  let client;
  try {
    client = await mongoClient.connect(dbUrl)
    let db = client.db(dbname)
    let user = await db.collection('users').findOne({email: req.body.email})
    if(user){
      res.redirect(`/:${user._id}/password-reset`)
    }else{
      client.close()
      res.json({
        message:'Enter the correct address'
      })
    }
  } catch (error) {
    if(client){
      client.close()
    }
    res.json({
      message:'Some Error Occurred'
    })
  }
})

router.put('/:userId/update-password' , async(req,res)=>{
  let client; 
  try {
    client = mongoClient.connect(dbUrl)
    let db = client.db(dbname)
    if(req.body.password == req.body.confPassword){
      req.body.password = await hashing.hashing(req.body.password)
      await db.collection('users').findOneAndUpdate({_id: ObjectId(req.params.userId)}, {$set:{password: req.body.password}})
      client.close()
      res.json({
        message: 'User Password updated Successfully'
      })
    }else{
      client.close()
      res.json({
        message: 'Passowrd and Confirm Password does not match'
      })
    }
  } catch (error) {
    if(client){
      client.close()
    }
    res.json({
      message: 'Some Error Occurred'
    })
  }
})
module.exports = router;
