/**
 * Created by Administrator on 2017/9/16.
 */
var express = require('express');
var router = express.Router();
router.get("/test",function(req,res){
    res.render("test");
});
module.exports=router;