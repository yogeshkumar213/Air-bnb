const mongoose=require ("mongoose");
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
    }
});
module.exports=mongoose.model("Review",reviewsSchema);