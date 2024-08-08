const Listing = require("../models/listing.js");

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    // res.send(Listings);
    res.render("listings/index.ejs", { allListings });
}
module.exports.renderNewForm = (req, res, next) => {

    res.render("listings/new.ejs")

}
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner")
    if (!listing) {
        req.flash("error", "listing which you requested does not exist");
        res.redirect("/listings");
    }
    // console.log(listing.owner);
    // console.log(find)
    res.render("listings/show.ejs", { listing })
}
module.exports.createListing=async (req,res,next)=>{
    //we can set default image with the help of javascript as well as use "default" parameter and set parameter 
    // which we have use listing.js file
 
     // if(!req.body.listing.imgage){
     //     req.body.listing.image={};
     // }
     // if(! req.body.listing.image.url){
     //     req.body.listing.image.url="https://tse1.mm.bing.net/th?id=OIP.AY6VgIwEbqiddBM8wGFFsAHaEo&pid=Api&P=0&h=180"
 
     // }
         const newListing=new Listing(req.body.listing);
         //we store current user information into newListing use req.user._id property we know passport store user info bydefaul in req.user
         
         newListing.owner=req.user._id
        //  console.log(newListing);
         await newListing.save();
         req.flash("success","new listing is created");
         res.redirect("/listings")
     
 }
 module.exports.renderEditForm=async (req,res,next)=>{

    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
       req.flash("error","listing which you want does not exist")
       res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
   
}
module.exports.updateListing=async (req,res,next)=>{
    let {id}=req.params;
    
    let listing=await Listing.findById(id);
    // if(listing.owner._id.equals(currUser._id)){
    console.log(listing)
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        

    // }else{
        req.flash("success"," listing updated sucessfully");
        res.redirect(`/listings/${id}`);
    // }
 }
 module.exports.distroyListing=async (req,res,next)=>{
    
    let {id}=req.params;
   let deleteListing= await Listing.findByIdAndDelete(id)
  
   console.log(deleteListing)
   req.flash("success","listing is sucessfully deleted");
   res.redirect("/listings")
}