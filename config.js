const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const dbUrl = 'mongodb://localhost:27017';
const dbname = 'shortUrl';
const ObjectId = mongodb.ObjectID;

module.exports = {mongoClient , dbUrl , dbname , ObjectId}