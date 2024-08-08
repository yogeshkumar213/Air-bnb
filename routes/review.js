const express=require("express");
const router=express.Router({mergeParams:true});
const {reviewSchema}=require("../Schema.js");  
const ExpressError=require("../utils/ExpressError.js");
const Listing=require ("../models/listing.js");
const asyncWrap=require("../utils/Asyncwrap.js");
const Review=require("../models/reviews.js")
const reviewController=require("../controller/review.js")
const { validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js");


//Reviews
//post route
router.post("/",isLoggedIn,validateReview,asyncWrap(reviewController.createReview));
  
  //Delete Review route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap (reviewController.distroyReview));
  // router.get("/:reviewId",(req,res)=>{
  //   console.log("hello")
  // })
     module.exports=router;

 
