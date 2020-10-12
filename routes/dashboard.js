var express = require('express');
var router = express.Router();

const authenticate = require('../common/authenticate')

const {mongoClient , dbUrl , dbname , ObjectId} = require('../config');

router.get('/:userId' , authenticate , async (req,res) =>{
    let client;
    try {
        client = await mongoClient.connect(dbUrl)
        let db = client.db(dbname)
        let allUrls = await db.collection('urlData').find().toArray()
        console.log(allUrls)
        let userCursor = await db.collection('urlData').findOne({userId: ObjectId(req.params.userId)})
        client.close()
        res.json({
            message: 'Fetch Successful',
            userCursor
        })
    } catch (error) {
        if(client){
            client.close()
        }
        res.json({
            message:'Some Error Occurred'
        })
    }
})



module.exports = router