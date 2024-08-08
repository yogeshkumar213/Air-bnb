const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
});
//passsportLocalMongoose automatically create usename ,hashed and salting password so that's why we have to plagin
userSchema.plugin(passportLocalMongoose); 
module.exports= mongoose.model("User",userSchema);
