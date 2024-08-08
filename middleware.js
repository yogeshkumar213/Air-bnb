const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./Schema.js");
const Review=require("./models/reviews.js")
  
const Listing=require ("./models/listing.js");
module.exports.isLoggedIn=((req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl)
    if(!req.isAuthenticated()){
        // if a persion is authenticated on our website then no problem easily it can go on desire route but if 
        // a persion is not login/authonticated then it will click on any desire things like if he want add new listin,edit then he must be do loggin
        //to do these things but after login user will be redirect on "/listings" route that is unconvinience means that is not 
        //user-friendly instead of this if user click "add new" after login he will redirect on "add new page" not"/listings"
        //after login property of passport it does reset the session 
        //login karne se phle hum req.originalUrl ko store krra lenge session mai means user ne kis per click kiya tha
        //or us original url ko access karne k liye usko hum middleware mai locals variable mai store krra denge too usko hum user.js mai access kar skte hai
       req.session.redirectUrl=req.originalUrl;
    //    console.log(req.session.redirectUrl)
        req.flash("error","you must be logged in to create listing")
       return res.redirect("/login")
    }
    next()

});
module.exports.saveRedirectUrl=(req,res,next)=>{
    // console.log(req.session.redirectUrl)
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}
module.exports.validateListing=(req,res,next)=>{
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
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
       // console.log(error.details);
    if(error){
        // res.send("eror occuring")
        // console.log(error)

        let revErr=error.details.map((el)=>el.message).join(",")
        
        next( new ExpressError(400,revErr));
        // console.log(revErr)
       
    }else{
        next();
    }
}
// authorization for listings
module.exports.isOwner=async (req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(! listing.owner._id.equals(res.locals.currUser._id)){
       req.flash("error","you are not owner of this listing")
       res.redirect(`/listings/${id}`)
    }
    next();
}  

module.exports.isReviewAuthor=async (req,res,next)=>{
    let{id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    console.log(review)
    // console.log(Review.author);
    if(! review.author._id.equals(res.locals.currUser._id)){
        console.log(res.locals.currUser._id);
       req.flash("error","you are not the author of this review")
      return res.redirect(`/listings/${id}`)
    }
    next();
} 