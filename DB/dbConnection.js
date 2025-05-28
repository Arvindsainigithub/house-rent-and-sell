const mongoose = require('mongoose')
require('dotenv').config()
const dbConnection = async()=>{
    mongoose.connect(process.env.ATLAS_URL)
    .then(console.log("Database connected"))
    .catch((err)=>{console.log("Error occuring while connecting",err)})
}
module.exports = dbConnection;