const express=require("express");
const mongoose=require("mongoose");
const Listing=require ("./models/listing.js");
const methodOverride=require("method-override");
const asyncWrap=require("./utils/Asyncwrap.js");
const ExpressError=require("./utils/ExpressError.js");
const Review=require("./models/reviews.js")

const {listingSchema,reviewSchema}=require("./Schema.js");


const ejsMate=require("ejs-mate");
const path=require("path");
const app=express ();
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
const port =8080;
app.set("views",path.join(__dirname ,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
main()
.then(()=>{
    console.log("connection established")
}).catch((err)=>{
    console.log(err)
});


async function main(){
    await mongoose.connect(MONGO_URL)
}
app.get("/",(req,res)=>{
    res.send("wonderlust")
});

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
       // console.log(error.details);
    if(error){
        // res.send("eror occuring")
        // let revErr=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,"something wrong");
    }else{
        next();
    }
}
const validateListing=(req,res,next)=>{
     //listeningschema means joi constraint/joi schema. does my req.body satisfying the lisginingSchema(joi constraint) or not ?
    let{error}=listingSchema.validate(req.body);
    if(error){
        //    This is an array provided by Joi that contains detailed information about each validation error. Each element in this array is an object that represents a specific validation error.
        let errMsg=error.details.map((el)=>el.message).join(",")
        // console.log(error)
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing(
//         {
//             title:"My New villa",
//             description:"By the beach",
//             price:1299,
//             location:"calagute,Goa",
//             country:"India",
//         }
//     );
//     await sampleListing.save();
//     console.log("sample was saved")
//     res.send("succescful testing")
// });


//post route
app.post("/listings/:id/reviews",validateReview,asyncWrap(async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
    let newReviews=new Review(req.body.review);
    listing.reviews.push(newReviews);

   
   await newReviews.save();
   await listing.save();
//    res.send("reviews was saved")

    res.redirect(`/listings/${listing._id}`)
}));

//Index route
app.get("/listings", asyncWrap(async (req,res,next)=>{
    const allListings= await Listing.find({});
    // res.send(Listings);
    res.render("index.ejs",{allListings});
}));

//new route
app.get("/listings/new",(req,res,next)=>{
    res.render("new.ejs")
})

//show individual listing
app.get("/listings/:id",asyncWrap(async (req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    // console.log(find)
    res.render("show.ejs",{listing})
}));

//Create new listings

app.post("/listings",validateListing,asyncWrap(async (req,res,next)=>{
   //we can set default image with the help of javascript as well as use "default" parameter and set parameter 
   // which we have use listing.js file

    // if(!req.body.listing.imgage){
    //     req.body.listing.image={};
    // }
    // if(! req.body.listing.image.url){
    //     req.body.listing.image.url="https://tse1.mm.bing.net/th?id=OIP.AY6VgIwEbqiddBM8wGFFsAHaEo&pid=Api&P=0&h=180"

    // }
        const newListing=new Listing(req.body.listing);
        console.log(newListing);
        await newListing.save();
        res.redirect("/listings")
    
}));


//edit route
app.get("/listings/:id/edit",validateListing,asyncWrap (async (req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    res.render("edit.ejs",{listing});
}));

// update route
app.put("/listings/:id",asyncWrap(async (req,res,next)=>{
   let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);

}));
//delete route
app.delete("/listings/:id",asyncWrap(async (req,res,next)=>{
    console.log("delete succesfully")
    let {id}=req.params;
   let deleteListing= await Listing.findByIdAndDelete(id)
   res.redirect("/listings")
}));

//catch all route
app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page not found"))
});

//errhandling middleware in backend
app.use((err,req,res,next)=>{
    let {statusCode =500, message ="something went wrong"}=err;
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message)
})


app .listen(port,(req,res)=>{
    console.log(`listening port at${port}`)
});