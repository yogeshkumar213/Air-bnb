// production k time hum .env ko use nhi karenge us time hum apne node enviornment ko use karenge production k
if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
// console.log(process.env.CLOUD_API_KEY)


const express = require("express");
const mongoose = require("mongoose");
// const Listing=require ("./models/listing.js");
const methodOverride = require("method-override");
// const asyncWrap=require("./utils/Asyncwrap.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");

const asyncWrap = require("./utils/Asyncwrap.js");
const User = require("./models/user.js")
// const Review=require("./models/reviews.js")

// const {listingSchema,reviewSchema}=require("./Schema.js");  
const ejsMate = require("ejs-mate");
const path = require("path");
// const reviews = require("./models/reviews.js");
const Listing = require("./models/listing.js")
const app = express();



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl=process.env.ATLASDB_URL;
main()
    .then(() => {
        console.log("connection established")
    }).catch((err) => {
        console.log(err)
    });


async function main() {
    await mongoose.connect(dbUrl)
}

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 8080;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));


// app.get("/trending",(req,res)=>{
//     res.send("wonderlust")
// });

const store= MongoStore.create({
     mongoUrl:dbUrl,
     crypto:{
        secret:process.env.SECRET,
     },
     touchAfter:24*3600   // time period in seconds
    })


    store.on("error",()=>{
        console.log("Error in mongo session store",err)
    })
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,

    }
}
app.use(session(sessionOption))


//use flash package
const flash = require("connect-flash");
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
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.currUser)
    next();
});







app.use("/", userRouter)


app.get("/listings/filter", asyncWrap(async (req, res) => {
    // console.log("Filter req received");
    let category = req.query.category;
    // console.log(category)

    let listing = await Listing.find({ category: { $in: [category] } })
    // console.log(listing)
    if (listing.length === 0) {
        req.flash("error", `currently we have no listing is related to ${category}.You can see another type of listings`)
        return res.redirect("/listings")
    } else {
        console.log(listing)
        let explicitMessage=`listing related to ${category}`
        res.render("listings/option.ejs", { listings: listing ,explicitMessage});
    }
}))
//search route
//The first argument, finalSearch, is the string we want to search for in the database. It’s converted to lowercase earlier so we can match it without worrying about case.
// The second argument, 'i', is a flag that makes the search case -insensitive.This means that whether the stored value in the database is in uppercase, lowercase, or a mix of both, 
// the search will still match it if the characters are otherwise identical.
    app.post("/listings/search/list", async (req, res) => {
        let search = req.body.search.trim(); // Trim any extra whitespace
        let finalSearch = search.toLowerCase(); // Convert input to lowercase

        try {
            // Perform case-insensitive search using $regex with the 'i' flag
            let allListings = await Listing.find({
                $or: [
                    { location: { $regex: new RegExp(finalSearch, 'i') } },
                    { country: { $regex: new RegExp(finalSearch, 'i') } }
                ]
            });

            console.log(allListings);

            if (allListings.length === 0) {
                req.flash("error", "Sorry, we have no listings regarding your search.");
                return res.redirect("/listings");
            } else {
                let explicitMessage=`listigs for ${search} search`
                 res.render("listings/search.ejs", { allListings,explicitMessage});
                
            }
        } catch (err) {
            console.error(err);
            req.flash("error", "An error occurred while searching.");
            return res.redirect("/listings");
        }
    });





// app.get("/listings/filter", async (req, res) => {
//     return res.send("This is a test response for filtering.");
// });




app.use("/listings", listingRouter)
//note if we use normal way then we find an error when we create any review because id of this listing is not
// is not going to the reviews.js file so we use mergeparams property such that id revew.js file mai ja skke
// ager hmmare routes k ander kuch parrameter hai jo agge use ho skte hai hmmare callback mai then always we use merageparams property in express.Router
app.use("/listings/:id/reviews", reviewRouter)
// when we use router property to optimize the serverside code means CRUD operation (/listings/:id/reviews) this route is called parent route means comman route mtlb jo starting mai hogga hi hogga
//and or agger review file mai jo route use huye hai called child route

//catch all route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"))
});


//errhandling middleware in backend
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode)
    res.render("error.ejs", { err });

});



app.listen(port, (req, res) => {
    console.log(`listening port at${port}`)
});