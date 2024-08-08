const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require("../utils/Asyncwrap.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controller/user.js")

//signup
router.route("/signup")
.get( userController.renderSignupForm)
.post( asyncWrap(userController.signup));

//login
router.route("/login")
.get( userController.renderLoginForm)
//Passport provides an authenticate() function, which is used as route middleware to authenticate requests.

//failureFlash refer if the user is not login then it will some message will be flash
.post(saveRedirectUrl,
    passport.authenticate('local', { 
        failureRedirect: '/login',
         failureFlash: true }),
      userController.login
);

router.get("/logout",userController.loggout)


module.exports = router;