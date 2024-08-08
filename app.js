const express=require("express");
const mongoose=require("mongoose");
// const Listing=require ("./models/listing.js");
const methodOverride=require("method-override");
// const asyncWrap=require("./utils/Asyncwrap.js");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")
// const Review=require("./models/reviews.js")

// const {listingSchema,reviewSchema}=require("./Schema.js");  
const ejsMate=require("ejs-mate");
const path=require("path");
// const reviews = require("./models/reviews.js");
const app=express ();



const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

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

app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const port =8080;
app.set("views",path.join(__dirname ,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public")));
app.get("/",(req,res)=>{
    res.send("wonderlust")
});
const sessionOption={
    secret:"mysuperseceretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        httpOnly:true,

    }
}
app.use(session( sessionOption))


//use flash package
const flash=require("connect-flash");
app.use(flash());



app.use(passport.initialize());
//why we use passport.session() we want user can do only one time sinup/login in a session not when it switch any page
app.use(passport.session());
//we want authenticate the model (User) using LocalStrategy in passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//jo value hmme render karwant hai appni ejs file k sath usse hum res.locals mai store kar denge hmmne res.locals k 
//ander ek (res.locals.success) success variable create kiya or uske ander hmmne jo flash karwana hai usko store kar diya
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // console.log(res.locals.currUser)
    next();
}); 

app.get("/registerUser",async (req,res)=>{
    let fakeUser=new User({
        email:"yogesh@gmail.com",
        username:"yogesh"
    })
    let newUser=await User.register(fakeUser,"abc@123");
    res.send(newUser);
})


app.use("/",userRouter)
app.use("/listings",listingRouter)
//note if we use normal way then we find an error when we create any review because id of this listing is not
// is not going to the reviews.js file so we use mergeparams property such that id revew.js file mai ja skke
// ager hmmare routes k ander kuch parrameter hai jo agge use ho skte hai hmmare callback mai then always we use merageparams property in express.Router
app.use("/listings/:id/reviews",reviewRouter)
// when we use router property to optimize the serverside code means CRUD operation (/listings/:id/reviews) this route is called parent route means comman route mtlb jo starting mai hogga hi hogga
//and or agger review file mai jo route use huye hai called child route

    //catch all route
    app.all("*",(req,res,next)=>{
        next(new ExpressError(404,"Page not found"))
        });
   

//errhandling middleware in backend
app.use((err,req,res,next)=>{
    let {statusCode =500, message ="something went wrong"}=err;
    res.status(statusCode)
    res.render("error.ejs",{err});
   
});


app .listen(port,(req,res)=>{
    console.log(`listening port at${port}`)
});