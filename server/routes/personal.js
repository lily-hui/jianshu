/**
 * Created by Administrator on 2017/9/28.
 */
var express=require("express");
var router=express.Router();
var mysql=require("mysql");
var DBconfig=require("../config/DBconfig.js");
var sql=require("../module/sql.js");
var jwt=require("jwt-simple");

const api=require("./api");

//个人中心路由
router.post("/getPersonalCenterInfo/:who",function(req,res){
    var responseDate={};
    if(req.params.who=="blog" && req.body.userId)
    {
        console.log("个人blog");

        try{
            var page=api.getQuery(req.url);
            var reg=/^\d{1,7}$/g;
            if(!reg.test(""+page))
            {
                console.log("page格式错误");
                return false;
            }
        }catch(err)
        {
            console.log(err.message);
        }

        var userId=parseInt(req.body.userId);
        var reg=/^\d{1,8}$/g;
        if(!reg.test(""+userId))
        {
            console.log("用户的id格式错误");
            return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据连接失败:"+err); return false;}
            conn.query(sql.getPersonCenterBlog,[userId,page],function(err,result){
                if(err){console.log("查询语句出粗:"+err); return false;}
                if(result[0])
                {
                    responseDate.status=0;
                    responseDate.code=result;
                }
                else
                {
                    console.log("没有查到");
                    responseDate.status=1;
                }
                res.json(responseDate);
            });
            conn.release();
        });
    }

    if(req.params.who=="info" && req.body.userId)
    {
        console.log("获取个人中心的信息");
        var userId=parseInt(req.body.userId);
        var reg=/^\d{1,8}$/g;
        if(!reg.test(""+userId))
        {
            console.log("用户的id格式错误");
            return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.personalCenterUserInfo,[userId],function(err,result){
                if(err){console.log("查询语句出错:"+err); return false;}
                if(result[0])
                {
                    responseDate.status=0;
                    responseDate.code=result;
                }
                else
                {
                    console.log("数据为空");
                    responseDate.status=1;
                }
                res.json(responseDate);
            });
            conn.release();
        });

    }

    if(req.params.who=='like')
    {
        try{
            var page=api.getQuery(req.url);
            var reg=/^\d{1,7}$/g;
            if(!reg.test(""+page))
            {
                console.log("page格式错误");
                return false;
            }
        }catch(err)
        {
            console.log(err.message);
        }

        if(req.body.userId)
        {
            var userId=parseInt(req.body.userId);

            try{
                var page=api.getQuery(req.url);
                var reg=/^\d{1,7}$/g;
                if(!reg.test(""+page))
                {
                    console.log("page格式错误");
                    return false;
                }
            }catch(err)
            {
                console.log(err.message);
            }

            var pool=api.getPool();
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败:"+err);return false;}
                conn.query(sql.personalLikeArtical,[userId,page],function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                        responseDate.status=0;
                        responseDate.code=result;
                    }
                    else
                    {
                        console.log("没有喜欢的文章");
                        responseDate.status=1;
                    }
                    res.json(responseDate);
                });
                conn.release();
            });
        }
    }

    if(req.params.who=='concern' &&req.body.userId)
    {
        console.log("concern");
        try{
            var page=api.getQuery(req.url);
            var reg=/^\d{1,7}$/g;
            if(!reg.test(""+page))
            {
                console.log("page格式错误");
                return false;
            }
        }catch(err)
        {
            console.log(err.message);
        }

        var userId=parseInt(req.body.userId);
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err); return false;}
            conn.query(sql.personalConcrenSearch,[userId,page],function(err,result){
                if(err){console.log("数据库查询语句出错:"+err); return false;}
                if(result[0])
                {
                    responseDate.status=0;
                    responseDate.code=result;
                    console.log(JSON.stringify(result));
                }
                else
                {
                    responseDate.status=1;
                    responseDate.code=[];
                }
                res.json(responseDate);
                conn.release();

            });
        });
    }
});


//查询个人所关注的作者  及其他们的文章<concern>
router.post("/getConcrenAuthor/:who",function(req,res){
    console.log("进入到getConcrenAuthor"+"路径为:"+req.params.who);
    var responseDate={};
    if(req.params.who=="author" && req.body.name=="jianshu" && req.body.token)
    {
        console.log("要查询的是作者");
        if(req.body.token)
        {
            var token=req.body.token;
            var tel=jwt.decode(token,"jianshu");
            var arr=tel.split(".");
            tel=arr[0];
            console.log("解析出来的电话号码是:"+tel);
            var pool=mysql.createPool(DBconfig.mysql);
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败:"+err); return false;}
                conn.query(sql.getConcrenAuthor,[tel],function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                        console.log(JSON.stringify(result));
                        responseDate.status=0;
                        responseDate.code=result;
                    }
                    else
                    {
                        console.log("没查到");
                        responseDate.status=1;
                    }
                    res.json(responseDate);
                });
                conn.release();
            });
        }
    }

    if(req.params.who=="artical" && req.body.userId && req.body.page)
    {
        console.log("artical路径");
        var page=parseInt(req.body.page);
        var userId=parseInt(req.body.userId);
        var pool=mysql.createPool(DBconfig.mysql);
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err); return false;}
            conn.query(sql.getConcrenAuthorAllArtical,[userId,page],function(err,result){
                if(err){console.log("查询语句出错:"+err);return false;}
                if(result[0])
                {
                    //console.log(JSON.stringify(result));
                    responseDate.status=0;
                    responseDate.code=result;
                }
                else
                {
                    console.log("没有查询到");
                    responseDate.status=1;
                }
                res.json(responseDate);
            });
            conn.release();
        })
    }

});


//查询前七天和前30天的文章

router.post("/getTimerArtical",function(req,res){
    console.log("进入到:getTimerArtical");
    var responseDate={};
    if(req.body.name=="jianshu" && req.body.day && req.body.page)
    {
        var day=parseInt(req.body.day);
        var page=parseInt(req.body.page);
        var reg=/^\d{1,2}$/g;
        if(!reg.test(page))
        {
            console.log("天数格式错误:");
            return false;
        }
        var reg=/^\d{1,2}$/g;
        if(!reg.test(day))
        {
            console.log("天数格式错误:");
            return false;
        }
        var pool=mysql.createPool(DBconfig.mysql);
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err); return false;}
            conn.query(sql.getTimeArtical,[day,page],function(err,result){
                if(err){console.log("查询语句出错:"+err); return false;}
                if(result[0])
                {
                    // console.log(JSON.stringify(result));
                    responseDate.status=0;
                    responseDate.code=result;
                }
                else
                {
                    console.log("没查到数据");
                    responseDate.status=1;
                }
                res.json(responseDate);
            });
            conn.release();
        })
    }
});


//获取个人关注作者的所有文章<concern>
router.post("/ConcrenAllArtical",function(req,res){
    console.log("j进入到:ConcrenAllArtical");
    var responseDate={};
    if(req.body.name=="jianshu" && req.body.token && req.body.page)
    {
        var token=req.body.token;
        var tel=jwt.decode(token,"jianshu");
        var page=parseInt(req.body.page);
        var reg=/^\d{1,4}$/g;
        if(!reg.test(page))
        {
            console.log("页数格式错误");
            return false;
        }
        var arr=tel.split(".");
        tel=arr[0];
        console.log(tel);
        var pool=mysql.createPool(DBconfig.mysql);
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.getUserId,[tel],function(err,result){
                if(err){console.log("数据库查询失败"+err);return false;}
                var userId;
                if(result[0])
                {
                    console.log(result[0]);
                    userId=result[0].userid;
                }
                console.log(userId);
                 conn.query(sql.getConcrenAuthorArtical,[userId,page],function(err,result){
                     if(err){console.log("数据库连接失败:"+err);return false;}
                     if(result[0])
                     {
                     console.log(JSON.stringify(result));
                     responseDate.status=0;
                     responseDate.code=result;
                     }
                     else
                     {
                     console.log("没有查询到数据");
                     responseDate.status=1;
                     }
                     res.json(responseDate);
                 });
                 console.log("----------------------");
                conn.release();
            });
        })
    }
});

//获取个人中心关注的内容
/*
router.post("/personalConcrenSearch",function(req,res){
    console.log("进入到personalConcrenSearch");
    var responseData={};
    //{name:'jianshu',userId:userId}
    if(req.body.name=='jianshu' && req.body.userId)
    {
        var userId=parseInt(req.body.userId);
        var pool=mysql.createPool(DBconfig.mysql);
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err); return false;}
            conn.query(sql.personalConcrenSearch,[userId],function(err,result){
                if(err){console.log("数据库查询语句出错:"+err); return false;}
                if(result[0])
                {
                    responseData.status=0;
                    responseData.code=result;
                   // console.log(JSON.stringify(result));
                }
                else
                {
                    responseData.status=1;
                    responseData.code=[];
                }
                res.json(responseData);
                conn.release();

            });
        });
    }
});
*/
//获取个人中心喜欢的文章
router.post("/personalLikeArtical",function(req,res){
    console.log("进入到:personalLikeArtical");
    var responseData={};
    if(req.body.name=="jianshu" && req.body.userId && req.body.page)
    {
        var userId=parseInt(req.body.userId);
        var page=parseInt(req.body.page);
        var pool=mysql.createPool(DBconfig.mysql);
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.personalLikeArtical,[userId,page],function(err,result){
                if(err){console.log("查询语句出错:"+err);return false;}
                if(result[0])
                {
                    responseData.status=0;
                    responseData.code=result;
                    //console.log("喜欢的文章:"+JSON.stringify(result));
                }
                else
                {
                    console.log("没有喜欢的文章");
                    responseData.code=[];
                    responseData.status=1;
                }
                res.json(responseData);
            });
            conn.release();
        });
    }
});
module.exports=router;