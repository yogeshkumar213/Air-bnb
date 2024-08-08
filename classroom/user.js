const express=require("express");
const router=express.Router();
// user
router.get("/:id/edit",(req,res)=>{
    res.send("Get for user")
})
router.get("/new",(req,res)=>{
    res.send("create new user")
});


router.get("/",(req,res)=>{
    res.send("Get User")
});


router.get("/:id",(req,res)=>{
    res.send("user-updated")
});
router.delete("/:id/delete",(req,res)=>{
    res.send("user deleted")
});
module.exports=router;