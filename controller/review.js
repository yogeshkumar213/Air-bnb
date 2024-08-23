const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");





module.exports.createReview=async(req,res,next)=>{
    // console.log(req.params.id)
      let listing=await Listing.findById(req.params.id);
      
      
      let newReviews=new Review(req.body.review);
      newReviews.author=req.user._id;
      
      // console.log(newReviews)
      listing.reviews.push(newReviews);
      let reviewSave= await newReviews.save();
   
     let listingSave=await listing.save();
   
  
     req.flash("success","new review is created");
  //   
      res.redirect(`/listings/${listing._id}`)
  // 
  // let data = req.body.review;
  // let currListing = await Listing.findById(id);
  // if(!currListing){
  //     res.send("no listing found");
  // }
  // let newReview = new Review(data);
  // currListing.reviews.push(newReview);
  // await newReview.save();
  // await currListing.save();
  // res.redirect(`/listings/${id}`);
  }


  module.exports.distroyReview=async(req,res,next)=>{
    //  console.log("deleted")
   
    console.log(req.session.redirectUrl);
     let {id,reviewId}=req.params;
    
      await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","review deleted");
     res.redirect(`/listings/${id}`)
     }