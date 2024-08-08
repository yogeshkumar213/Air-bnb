const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const asyncWrap = require("../utils/Asyncwrap.js");
const listingController = require("../controller/listing.js")


const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");

router.route("/") 
    .get(asyncWrap(listingController.index))
    .post(isLoggedIn, validateListing, asyncWrap(listingController.createListing));
//Index route


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    //show individual listing
    .get(asyncWrap(listingController.showListing))
    // update route
    .put(asyncWrap(listingController.updateListing))
    //delete route
    .delete(isLoggedIn, isOwner, asyncWrap(listingController.distroyListing));



// we use nested populate because we want to show author with each review so we define path

//Create new listings



//edit route
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingController.renderEditForm));

module.exports = router;
