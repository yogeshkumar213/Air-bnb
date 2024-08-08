const User = require("../models/user.js")

module.exports.renderSignupForm = (req, res) => {
    // res.send("hello")
    res.render("users/signup.ejs")
}
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser)
        req.login(registeredUser, (err) => {
            if (err) {
                next(err)
            }
            req.flash("success", "welcome on wonderlust");
            res.redirect("/listings")
        })
    } catch (e) {
        req.flash("error", "A user with the given username is already registered");
        res.redirect("/signup")
    }

}
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}
module.exports.login = async (req, res) => {
    console.log(res.locals.redirectUrl)
    req.flash("success", "Welcome on wonderlust!");

    // ager res.locals k ander redirectUrl hai nahi too"/listings" per redirect
    let redirectUrl =  res.locals.redirectUrl || "/listings";
    
    res.redirect(redirectUrl);
}
module.exports.loggout = (req, res, next) => {
    //req.logout is a method in passport it use serialization and deserialization in a current session
    //  it takes a callback as a parameter so lets we kept error as a callback
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "you are logout!")
        res.redirect("/listings");
    })
}