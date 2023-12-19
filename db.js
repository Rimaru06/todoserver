const mongoose = require("mongoose");
require('dotenv').config();
const MONGOURI = process.env.mongouri || ""

let isConnected = false;
const connectToMongo = async ()=>{
    if(isConnected){
        console.log("MonogDb is already connected")
        return;
    }
    try{
        await mongoose.connect(MONGOURI)
        isConnected = true;
        console.log("MongoDb Connected");
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectToMongo;