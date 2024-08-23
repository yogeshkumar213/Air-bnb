const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review=require ("./reviews.js");
const { required } = require("joi");
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: String,
    image: {
        url:String,
        filename:String
        // url: {
        //     type: String,
        //     default: "https://tse2.mm.bing.net/th?id=OIP.CMpr4Uy-D7Zg1WTtK6ni_QHaE8&pid=Api&P=0&h=180",
        //     set: (v) => 
        //         v === "" 
        //             ? "https://tse2.mm.bing.net/th?id=OIP.CMpr4Uy-D7Zg1WTtK6ni_QHaE8&pid=Api&P=0&h=180"
        //             : v
            
        // }
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            // required: true
          },
          coordinates: {
            type: [Number],
            // required: true
          }
    },
    category:{
        type:String,
        // required:true
        // enum:["mountain","farms","Rooms","Mountain city","Mountains","Castles","Amazing pools","Camping","Farms","Arctic"]
    }

       
    
});
// we have create post mongoose middleware which is work on findeOneDelete which is trigger by findByidAndDelete which is in listig delete route
//post mongoose middleware
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }

})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;