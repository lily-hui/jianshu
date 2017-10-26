/**
 * Created by Administrator on 2017/10/14.
 */
var DBConfig=require("../config/DBconfig");
const jwt=require("jwt-simple");
const mysql=require("mysql");
const crypto=require("crypto");
const url=require('url');

var api={
    //根据token获取用户电话号码
    getUserId:function (token) {
       var userId=jwt.decode(token,'jianshu');
       var arr=userId.split(".");
        userId=arr[0];
       return userId;
    },
    //根据用户id加密生成token
    getToken:function(userId){
        //由于电话一样,故产生的token也一样
        //----------------------------
        var ran= Math.random()*10000;
        ran=parseInt(ran);
        var you=userId+"."+ran;
        //加密
        var token=jwt.encode(you,"jianshu");
        //-------------------------
        return token;
    },
    //加密密码
    encodePassword:function(pwd){
        const hash =crypto.createHash('md5');
        hash.update(pwd);
        //密码加密存数据库
        var md=hash.digest("hex");
        return md;
    },
    //获取当前时间
    getNowTime:function(){
        var d = new Date();
        var time = d.getFullYear() + "-" +(d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        return time;
    },
    //获取连接
    getPool:function(){
        return mysql.createPool(DBConfig.mysql);
    },
    //获取路由参数
    getQuery:function(webUrl){
        try{
            var query=parseInt(url.parse(webUrl,true).query.page);
        }catch(err)
        {
            console.log("解析错误:"+err.message);
        }
        return query;
    }
};
module.exports=api;