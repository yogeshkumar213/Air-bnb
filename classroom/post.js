//post
const express=require("express")
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("Get for user")
})
router.post("/new",(req,res)=>{
    res.send("create new user")
});
router.put("/:id",(req,res)=>{
    res.send("user-updated")
});
router.delete("/:id/delete",(req,res)=>{
    res.send("user deleted")
});
module.exports=router;