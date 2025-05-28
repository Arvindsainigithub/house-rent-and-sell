const mongoose = require("mongoose");
const Review = require("./review");
const User = require('./user')

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
      url:String,
      filename:String
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review"
  }
],
owner:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'User',
},
category:{
  type:String,
  enum:['Trending','Rooms','Iconin Cities','Mountains','Castles',"Amazing Pools","Camping","Farms","Arctic"]
}
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : { $in: listing.reviews}});
  }
  
})

const List = mongoose.model("List", listingSchema);
module.exports = List
