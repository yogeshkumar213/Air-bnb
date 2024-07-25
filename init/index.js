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
    await Listing.insertMany(initData.data);
    console.log("data was saved")
};
initDB();
