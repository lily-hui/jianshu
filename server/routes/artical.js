/**
 * Created by Administrator on 2017/9/29.
 */

var express=require("express");
var mysql=require("mysql");
var crypto=require("crypto");
var DBconfig=require("../config/DBconfig.js");
var sql=require("../module/sql.js");
var jwt=require("jwt-simple");
var fs=require("fs");
var path=require("path");
var multiparty=require("multiparty");
const  api=require("./api");


var router=express.Router();

    //搜索文章页面该用户对该文章的作者与喜欢关系
router.post("/searchArticalLikeConcern",function(req,res){
    var responseData={};
    if(req.body.token && req.body.blogId) {
        var token = req.body.token;
        var userId = api.getUserId(token);
        var blogId = parseInt(req.body.blogId);
        var reg = /^\d{1,10}$/g;
        if (!reg.test(""+blogId))
        {
            console.log("blogId格式错误:");
            return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.judgeLike,[userId,blogId],function(err,result){
                if(err){console.log("数据库连接失败:"+err);return false;}
                if(result[0])
                {
                    responseData.likeStatus=0;
                    console.log(JSON.stringify(result));
                    // console.log("该用户已经有对该文章的喜欢记录。");
                }
                else
                {
                    responseData.likeStatus=1;
                    // console.log("该用户对该文章的喜好没有记录");
                }
                conn.query(sql.searchBlogAuthorFollow,[userId,blogId],function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                        responseData.followStatus=0;//该用户关注过该作者
                        console.log(JSON.stringify(result));
                    }
                    else
                    {
                        responseData.followStatus=1;//该用户未关注过该作者
                        console.log("该用户未关注过该作者");
                    }
                    res.json(responseData);
                });
            });
            conn.release();
        });
    }

});

    //添加喜欢
router.post("/addLike",function(req,res){
    var responseData={};
    console.log("进入到addLike");
    if( req.body.token && req.body.articalId && req.body.flag)
    {
        var follow=api.getUserId(req.body.token);
        var articalId=parseInt(req.body.articalId);
        var flag=parseInt(req.body.flag);
        var reg=/^\d{1,5}$/g;
        if(!reg.test(''+follow))
        {
            console.log("用户格式错误");
            return false;
        }
        var reg=/^\d{1,5}$/g;
        if(!reg.test(''+articalId))
        {
            console.log("作者格式错误");
            return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            if(flag==1)
            {
                //添加关注，先查看是否已经关注过
                conn.query(sql.judgeLike,[follow,articalId],function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                        //console.log("该用户已经喜欢过该文章");
                        responseData.status=0;//成功喜欢
                        res.json(responseData);
                    }
                    else
                    {
                        //console.log("该用户未喜欢过该作者");
                        conn.query(sql.addLike,[follow,articalId],function(err,result){
                            if(err){console.log("查询语句出错:"+err);return false;}
                            console.log("喜欢的结果:"+result);
                            if(result.insertId)
                            {
                                console.log("喜欢成功");
                                responseData.status=0;
                            }
                            res.json(responseData);
                        });
                    }
                });
                conn.release();
            }
            else
            {
                //取消喜欢，先查看是否已经喜欢过
                conn.query(sql.judgeLike,[follow,articalId],function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                        console.log("该用户已经喜欢过");
                        conn.query(sql.delLike,[follow,articalId],function(err,result){
                            if(err){console.log("查询语句出错:"+err);return false;}
                            console.log("取消喜欢的结果:"+JSON.stringify(result));
                            if(result)
                            {
                                responseData.status=1;
                                res.json(responseData);
                            }
                        });
                    }
                    else
                    {
                        console.log("该用户未喜欢过该文章");
                        responseData.status=1;
                        res.json(responseData);

                    }
                });
                conn.release();

            }
        })

    }
});

//搜索页面
router.post("/search/user",function(req,res){
    var responseData={};
    if(req.body.searchContent)
    {
        try{
            console.log("进入到user");
            var search=req.body.searchContent.trim();
            var page=api.getQuery(req.url)-0;
        }catch(err)
        {
            console.log("参数错误"+err.message);
            return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn) {
            if (err) {console.log("数据库连接失败:" + err);return false;}
            page<0 ? page=0:page=page*8;
            console.log(page);
            var searchUser = "SELECT nickname,userid ,head,IF(introduce is null,'',introduce) as introduce,IF(fans_count is null,0,fans_count) as fans,sum(size) as size,sum(like_count) as lik_num FROM (SELECT `user`.userid,`user`.head, `user`.nickname,`user`.introduce,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count,COUNT(DISTINCT follow.follow_id) AS fans_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN follow ON `user`.userid = `follow`.followed WHERE `user`.userid in (select userid from user where nickname like '%" + search + "%') GROUP BY blog.blog_id ,follow.followed ) p GROUP BY userid limit " + page + ",8";
            conn.query(searchUser,function (err, result) {
                if (err) {console.log("user查询语句出错:" + err);return false;}
                try{
                    result[0] ? responseData.status=0:responseData.status=1;
                    responseData.code = result;
                    //console.log(JSON.stringify(result));
                    res.json(responseData);
                }catch(err)
                {
                    console.log(err.message);
                    return false;
                }
            });
            conn.release();
        })
    }
});
router.post("/search/art",function(req,res){
    var responseData={};
    if(req.body.searchContent)
    {
        try{
            console.log("进入到art");
            var search=req.body.searchContent.trim();
            var page=api.getQuery(req.url)-0;
        }catch(err)
        {
            console.log("参数错误"+err.message);
            return false;
        }
        var pool=api.getPool();
        page<0 ?page=0:page=page*8;
        var searchArtical="SELECT blog.*,`user`.nickname AS author,`user`.head as head, category.categoryname, count(distinct `like`.like_id) as like_count,COUNT(DISTINCT `comment`.comment_id) AS comment_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN `comment` ON `comment`.blog_id=blog.blog_id WHERE blog.title like "+"'%"+search+"%'"+" GROUP BY blog.blog_id ,`comment`.blog_id limit "+page+",8";
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(searchArtical,function(err,result){
                if(err){console.log("查询语句出错:"+err);return false;}
                try{
                    result[0] ? responseData.status=0 :responseData.status=1;
                    responseData.code=result;
                    //console.log(JSON.stringify(result));
                    res.json(responseData);
                }catch(err)
                {
                    console.log("结果错误"+err);
                    return false;
                }
            });
            conn.release();
        })
    }
});




/*
    //添加关注
    router.post("/addFollow",function(req,res){
        console.log("addFollow");
        var responseData={};
        //{name:"jianshu",author:id,follow:follow,flag:flag}
        if(req.body.name=="jianshu" && req.body.author && req.body.follow && req.body.flag)
        {
            var follow=parseInt(req.body.follow);
            var author=parseInt(req.body.author);
            var flag=parseInt(req.body.flag);
            var reg=/^\d{1,5}$/g;
            if(!reg.test(''+follow))
            {
                console.log("用户格式错误");
                return false;
            }
            var reg=/^\d{1,5}$/g;
            if(!reg.test(''+author))
            {
                console.log("作者格式错误");
                return false;
            }
            var pool=mysql.createPool(DBconfig.mysql);
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败"+err);return false;}
                //还需判断该用户是否已经关注过该
                if(flag==1)
                {
                    //添加关注，先查看是否已经关注过
                    conn.query(sql.judgeFollow,[author,follow],function(err,result){
                        if(err){console.log("查询语句出错:"+err);return false;}
                        if(result[0])
                        {
                            console.log("该用户已经关注过");
                            responseData.status=0;//关注成功
                            res.json(responseData);
                        }
                        else
                        {
                            console.log("该用户未关注过该作者");
                            conn.query(sql.addFollow,[follow,author],function(err,result){
                                if(err){console.log("查询语句出错:"+err);return false;}
                                console.log("关注的结果:"+result);
                                if(result.insertId)
                                {
                                    console.log("关注成功");
                                    responseData.status=0;
                                }
                                res.json(responseData);
                            });
                        }
                        conn.release();
                    });

                }
                else
                {
                    //取消关注，先查看是否已经关注过
                    conn.query(sql.judgeFollow,[follow,author],function(err,result){
                        if(err){console.log("查询语句出错:"+err);return false;}
                        if(result[0])
                        {
                            console.log("该用户已经关注过");
                            conn.query(sql.delFollow,[follow,author],function(err,result){
                                if(err){console.log("查询语句出错:"+err);return false;}
                                console.log("取消关注的结果:"+JSON.stringify(result));
                                if(result)
                                {
                                    responseData.status=1;
                                    res.json(responseData);
                                }
                            });
                        }
                        else
                        {
                            console.log("该用户未关注过该作者");
                            responseData.status=1;
                            res.json(responseData);

                        }
                        conn.release();
                    });
                }
            })
        }
    });


*/
    //搜索页面
/*
    router.post("/search/:who",function(req,res){
        //name:'jianshu',page:this.userPage,searchContent:this.searchContent
        var responseData={};
        if(req.params.who=="user")
        {
            if(req.body.name=="jianshu" && req.body.page && req.body.searchContent)
            {
                console.log("进入到user");
                var page=parseInt(req.body.page);
                var search=req.body.searchContent.trim();
                console.log(search);
                var pool=mysql.createPool(DBconfig.mysql);
                pool.getConnection(function(err,conn){
                    if(err){console.log("数据库连接失败:"+err);return false;}

                    // var searchUser="SELECT nickname ,userid,IF(introduce is null,'',introduce) as introduce,head,IF(sum(size) is null,0,sum(size)) as size,sum(distinct like_count) as like_count FROM ( SELECT blog.blog_id,blog.size,COUNT(DISTINCT `like`.like_id) AS like_count,`user`.* from `user` LEFT JOIN blog ON blog.user_id=`user`.userid LEFT JOIN `like` ON `like`.blog_id=blog.blog_id WHERE `user`.nickname like "+"'%"+search+"%'"+" GROUP BY blog.blog_id) p GROUP BY userid limit 0,"+page;
                    var searchUser="SELECT nickname,userid ,head,IF(introduce is null,'',introduce) as introduce,IF(fans_count is null,0,fans_count) as fans,sum(size) as size,sum(like_count) as lik_num FROM (SELECT `user`.userid,`user`.head, `user`.nickname,`user`.introduce,blog.blog_id,blog.size, count(distinct `like`.like_id) as like_count,COUNT(DISTINCT follow.follow_id) AS fans_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN follow ON `user`.userid = `follow`.followed WHERE `user`.userid in (select userid from user where nickname like '%"+search+"%') GROUP BY blog.blog_id ,follow.followed ) p GROUP BY userid limit 0,"+page;
                    conn.query(searchUser,function(err,result){
                        if(err){console.log("user查询语句出错:"+err);return false;}
                        if(result[0])
                        {
                            console.log("用户"+JSON.stringify(result[0]));
                            responseData.user=result;
                        }else{
                            responseData.user=[];
                            console.log("没查到用户");
                        }
                        var searchArtical="SELECT blog.*,`user`.nickname AS author,`user`.head as head, category.categoryname, count(distinct `like`.like_id) as like_count,COUNT(DISTINCT `comment`.comment_id) AS comment_count FROM blog LEFT JOIN `like` ON blog.blog_id = `like`.blog_id LEFT JOIN `category` ON blog.category_id = `category`.category_id LEFT JOIN `user` ON blog.user_id = `user`.userid LEFT JOIN `comment` ON `comment`.blog_id=blog.blog_id WHERE blog.title like "+"'%"+search+"%'"+" GROUP BY blog.blog_id ,`comment`.blog_id limit 0,"+page;
                        conn.query(searchArtical,function(err,result) {
                            if (err) {
                                console.log("artical查询语句出错:" + err);
                                return false;
                            }
                            if (result[0]) {
                                console.log("文章" + JSON.stringify(result[0]));
                                responseData.artical = result;
                            } else {
                                responseData.artical = [];
                                console.log("没查到文章");

                            }

                            // var searchCategory="SELECT * FROM category WHERE categoryname like "+"'%"+search+"%' limit 0,"+page;
                            var searchCategory="select cat.*,count(cat.category_id) as sum from jianshu2.category cat left join blog blo on cat.category_id=blo.category_id where cat.categoryname like "+"'%"+search+"%' group by cat.category_id limit 0,"+page;
                            conn.query(searchCategory, [search, page], function (err, result) {
                                if (err) {
                                    console.log("category查询语句出错:" + err);
                                    return false;
                                }
                                if (result[0]) {
                                    console.log("目录" + JSON.stringify(result[0]));
                                    responseData.category = result;
                                } else {
                                    responseData.category = [];
                                    console.log("没查到目录");

                                }
                                responseData.status=0;
                                res.json(responseData);
                            })
                        });
                        conn.release();

                    })
                });
            }
        }
    });
*/
module.exports=router;