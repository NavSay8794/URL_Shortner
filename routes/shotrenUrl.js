const express = require('express');
const router = express.Router();

const authenticate = require('../common/authenticate')

const { mongoClient, dbUrl, dbname, ObjectId } = require('../config');


//get short urls
router.get('/:userId', authenticate, async (req, res) => {
    let client;
    try {
        client = await mongoClient.connect(dbUrl)
        let db = client.db(dbname)
        let userUrlData = await db.collection('urlData').findOne({ userId: ObjectId(req.params.userId) })
        client.close()
        res.json({
            message: 'Fetch Successful',
            data: userUrlData
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


//create short url
let count = 0
let urlid = 0
router.post('/:userId/shortenUrl', authenticate, async (req, res) => {
    let client;
    count++
    urlid++
    try {
        client = await mongoClient.connect(dbUrl)
        let db = client.db(dbname)
        let user = await db.collection('users').findOne({ _id: ObjectId(req.params.userId) })
        let userUrlData = await db.collection('urlData').findOne({ userId: ObjectId(req.params.userId) })
        console.log(userUrlData)
        if (userUrlData) {
            if (userUrlData.longUrl != req.body.longUrl) {
                //base62 conversion
                let hashDigits = []
                let dividend = Number('' + user.user_id + '' + urlid)
                let remainder = 0

                while (Math.floor(dividend) > 0) {
                    remainder = dividend % 62
                    dividend = Math.round(dividend / 62)
                    hashDigits.push(remainder)
                }

                let b62A = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
                    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

                let hashDigitsCount = hashDigits.length
                let hashStrings = ""

                for (let i = 0; i < hashDigitsCount; i++) {
                    hashStrings += b62A[hashDigits[i]]
                }

                req.body.userId = ObjectId(req.params.userId)
                req.body.urlId = `${hashStrings}`
                req.body.createdDate = new Date()

                let shortened = await db.collection('urlData').insertOne(req.body)
                client.close()
                res.json({
                    message: 'Url Shortened Successfully'
                })
            } else {
                client.close()
                res.json({
                    message: 'Corresponding shortened url exists'
                })
            }
        } else {
            let hashDigits = []
            let dividend = Number('' + user.user_id + '' + urlid)
            let remainder = 0

            while (Math.floor(dividend) > 0) {
                remainder = dividend % 62
                dividend = Math.round(dividend / 62)
                hashDigits.push(remainder)
            }

            let b62A = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
                'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

            let hashDigitsCount = hashDigits.length
            let hashStrings = ""

            for (let i = 0; i < hashDigitsCount; i++) {
                hashStrings += b62A[hashDigits[i]]
            }

            req.body.userId = ObjectId(req.params.userId)
            req.body.urlId = `${hashStrings}`
            req.body.createdDate = new Date()

            let shortened = await db.collection('urlData').insertOne(req.body)
            client.close()
            res.json({
                message: 'Url Shortened Successfully'
            })
        }
    } catch (error) {
        if (client) {
            client.close()
        }
        res.json({
            message: 'Some Error Occurred'
        })
    }
})

module.exports = router