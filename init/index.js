const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
const Listing=require("../models/listing.js");
const initData=require("./data.js")
main()
.then(()=>{
    console.log("connection established")
}).catch((err)=>{
    console.log(err)
});


async function main(){
    await mongoose.connect(MONGO_URL)
};
const initDB=async ()=>{
    await Listing.deleteMany({});
    //initData k ander jo data hai uske upper map function lgga do or jo individual listing hai wo too aayengi hi aayengi or uske sath owner property 
    // bhi set kar do each listing k sath map function ek nya array create karta hai so phle walla delete ho jayega data using Listing.deleteMany({})
    initData.data=initData.data.map((obj)=>({...obj,owner:'66b0b5b7ecf6680fe883ee1d'}))
    await Listing.insertMany(initData.data);
    console.log("data was saved")
};
initDB();
