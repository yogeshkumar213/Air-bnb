const mongoose=require ("mongoose");
const Schema = mongoose.Schema;
const User=require("./user.js")
const reviewsSchema=new mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created_At:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:User
    }
});
module.exports=mongoose.model("Review",reviewsSchema);