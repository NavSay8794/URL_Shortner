const express = require('express');
const router = express.Router();

// const authenticate = require('../common/authenticate')

const { mongoClient, dbUrl, dbname, ObjectId } = require('../config');


router.get('/:urlId', async(req,res)=>{
    let client;
    try {
        client = await mongoClient.connect(dbUrl)
        let db = client.db(dbname)
        let getUrl = await db.collection('urlData').findOne({urlId: req.params.urlId})
        res.redirect(getUrl.longUrl)
        client.close()
    } catch (error) {
        if(client){
            client.close()
        }
        res.json({
            message: 'some error occurred'
        })
    }
})
module.exports = router