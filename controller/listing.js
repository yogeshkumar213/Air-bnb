const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// const geocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    // res.send(Listings);
    res.render("listings/index.ejs", { allListings });
}

// module.exports.option = async (req, res, next) => {
// app.get("/listings/filter", async (req, res) => {
//     const category = req.query.category
//     const listing = await Listing.find({ category: { $in: category } })
//     // console.log(listing);
//     res.render("listings/option.ejs", { listings: listing });
// })
// }









module.exports.renderNewForm = (req, res, next) => {

    res.render("listings/new.ejs")
    // res.render("option.ejs");

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
module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send()

    //we can set default image with the help of javascript as well as use "default" parameter and set parameter 
    // which we have use listing.js file

    // if(!req.body.listing.imgage){
    //     req.body.listing.image={};
    // }
    // if(! req.body.listing.image.url){
    //     req.body.listing.image.url="https://tse1.mm.bing.net/th?id=OIP.AY6VgIwEbqiddBM8wGFFsAHaEo&pid=Api&P=0&h=180"

    // }
    let url = req.file.path;
    let filename = req.file.filename;


    //  note imp In JavaScript, when you're accessing a property of an object using bracket notation,
    //  the key inside the brackets needs to be a string, and strings in JavaScript are enclosed in quotes 
    console.log(req.body.listing['category'])


    const newListing = new Listing(req.body.listing);

    newListing.image = { url, filename }


    //we store current user information into newListing use req.user._id property we know passport store user info bydefaul in req.user

    newListing.owner = req.user._id
    newListing.geometry = response.body.features[0].geometry;

    // console.log(newListing);
    await newListing.save();
    req.flash("success", "new listing is created");
    res.redirect("/listings")

}

module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing which you want does not exist")
        res.redirect("/listings");
    }
    //we want to show blur image in our edit.ejs file this property and another image transfromation property provided by cloudenary documentation
    let originalImageUrl = listing.image.url;
    if (originalImageUrl.includes("cloudinary.com")) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

    }

    res.render("listings/edit.ejs", { listing, originalImageUrl });

}

module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    //if we have not added any file then those case it show an eror means how this extract url,filename in req.file so we use if statement
    //typeof operater in javaScript tells that the value is defined of undefined
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }
        await listing.save();
    }

    req.flash("success", " listing updated sucessfully");
    res.redirect(`/listings/${id}`);

}
module.exports.distroyListing = async (req, res, next) => {

    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id)

    console.log(deleteListing)
    req.flash("success", "listing is sucessfully deleted");
    res.redirect("/listings")
}