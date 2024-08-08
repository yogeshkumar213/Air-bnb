const express=require("express");
const cookieParser=require("cookie-parser");
const flash=require("connect-flash");
const path=require("path");


const app=express();

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));

app.use(cookieParser("secretcode"));
const user=require("./user.js")
const post=require("./post.js");
const session = require("express-session");
app.use(
    session({
        secret:"mysuperSecret",
        resave:false,
        saveUninitialized:true
    }));

app.use(flash());

const port=3000;


app.get("/test",(req,res)=>{
    res.send("test was successfully")
})
app.get("/getcookies",(req,res)=>{
    res.cookie("Greet","Nameste");
    res.cookie("madeIn","India")
    console.log(req.cookies);
    res.send("cookie was send")
});

app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;
    //using req.flash this method flash message only one time after the refresh the message will be gone
    req.flash("success","user successfully registered")
  res.redirect("/hello")
})
app.get("/hello",(req,res)=>{
    res.locals.messages=req.flash("success")

   res.render("page.ejs",{name:req.session.name })
})

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++
//     }
//     else{
//         req.session.count=1;
    
//     }
//     res.send(`user send req ${req.session.count} times`)

// });


app.get("/who",(req,res)=>{
  let{name}=  req.cookies;
    res.send(`hi mr ${name}`)
});

app.get("/signedcookies",(req,res)=>{
    res.cookie("color","red",{signed:true})
    res.send("done")
});

//verify signed cookies
app.get("/verify",(req,res)=>{
   console.log( req.signedCookies)
   res.send("cookies verified")
})
app.get("/",(req,res)=>{
    console.dir(req.cookies)
});
app.get("/",(req,res)=>{
    res.send("express is working")
});
app.use("/user",user);
app.use("/post",post);

app.listen(port,()=>{
    console.log("listening is start") 
});
