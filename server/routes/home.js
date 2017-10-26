/**
 * Created by Administrator on 2017/9/25.
 */
var express=require("express");
var router=express.Router();
var sql=require("../module/sql.js");

var jwt=require("jwt-simple");
var mysql=require("mysql");

const api=require("../routes/api");

//-----------------------home页面----------------
    //获取文章<home>
router.post('/getArtical',function(req,res){
    var responseData={};
    try{
        var page=api.getQuery(req.url);
    }
    catch(err){
        console.log("page为空:"+err.message);
    }
    var reg=/^\d{1,7}$/g;
    if(!reg.test(page))
    {
        console.log("页码数为:"+page);
        return false;
    }
    var pool=api.getPool();
    pool.getConnection(function(err,conn){
        if(err){console.log("数据库连接失败:"+err);return false;}
        conn.query(sql.getArtical,[page],function(err,result){
           if(result[0])
           {
               responseData.status=0;
           }
           else
           {
               responseData.status=1;
           }
           responseData.code=result;
           res.json(responseData);
        });
        conn.release();
    });

});

    //获取推荐的作者<home,seven,thirty>
router.post("/getRecommendAuthor/:log",function(req,res){
    var responseDate={};
    try{
        var page = api.getQuery(req.url);
    }catch(err){
        console.log("参数错误:"+err.message);
    }
    var reg = /^\d{1,6}$/g;
    if (!reg.test(page))
    {
        return false;
        console.log("页码:" + page);
    }
    if(req.params.log=='login')
    {
        var token = req.body.token;
        var userId = api.getUserId(token);

        var pool=api.getPool();
        pool.getConnection(function (err,conn) {

            if (err) {console.log("数据库连接失败:" + err); return false;}
            conn.query(sql.recommendAuthorHomeLogin, [userId, page], function (err, result) {
                if (err) {
                    console.log("recommendAuthorHomeLogin查询语句出错:" + err);
                    return false;
                }
                if (result[0]) {
                    responseDate.status = 0;
                }
                else {
                    responseDate.status = 1;//没获取到数据
                }

                responseDate.code = result;
                res.json(responseDate);
            });
            conn.release();
        });
    }
    else
    {
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.recommendAuthorHome,[page],function(err,result){
                if(err){console.log("recommendAuthorHome查询语句出错:"+err); return false;}
                if(result[0])
                {
                    responseDate.status=0;
                }
                else{
                    responseDate.status=1;//没获取到数据
                }
                responseDate.code=result;
                res.json(responseDate);
            });
            conn.release();
        })
    }

});

    //作者的关注<artical,seven,home,thirty,recommendAuthor>
router.post("/addFollow",function(req,res){
    var responseData={};
    if(req.body.author  && req.body.flag && req.body.token)
    {
        var token=req.body.token;
        var follow=parseInt(api.getUserId(token));
        var author=parseInt(req.body.author);
        var flag=parseInt(req.body.flag);
        var reg=/^\d{1,5}$/g;
        if(!reg.test(''+author))
        {
            console.log("作者格式错误");
            return false;
        }
        var pool=api.getPool();

        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败"+err);return false;}
            //还需判断该用户是否已经关注过该
            if(flag==1)
            {
                //添加关注，先查看是否已经关注过
                conn.query(sql.judgeFollow,[follow,author],function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                        // console.log("该用户已经关注过");
                        responseData.status=0;//关注成功
                        res.json(responseData);
                    }
                    else
                    {
                        // console.log("该用户未关注过该作者");
                        conn.query(sql.addFollow,[follow,author],function(err,result){
                            if(err){console.log("查询语句出错:"+err);return false;}
                            if(result.insertId)
                            {
                                // console.log("关注成功");
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
                //取消关注，先查看是否已经关注过
                conn.query(sql.judgeFollow,[follow,author],function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                        conn.query(sql.delFollow,[follow,author],function(err,result){
                            if(err){console.log("查询语句出错:"+err);return false;}
                            if(result)
                            {
                                responseData.status=1;
                                res.json(responseData);
                            }
                        });
                    }
                    else
                    {
                        responseData.status=1;
                        res.json(responseData);
                    }
                });
                conn.release();
            }
        })
    }
});

    //查询前七天和前30天的文章
router.post("/getTimerArtical",function(req,res){
    var responseDate={};
    try{
        var page=api.getQuery(req.url);
    }catch(err)
    {
        console.log("解析错误:"+err.message);
    }
    if(req.body.day)
    {
        var day=parseInt(req.body.day);
        var reg=/^\d{1,2}$/g;
        if(!reg.test(""+page))
        {
            console.log("天数格式错误:");
            return false;
        }
        var reg=/^\d{1,2}$/g;
        if(!reg.test(""+day))
        {
            console.log("天数格式错误:");
            return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err); return false;}
            conn.query(sql.getTimeArtical,[day,page],function(err,result){
                console.log(sql.getTimeArtical);
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

    //获取单个文章的信息<artical>
router.post("/getSingleArtical",function(req,res) {
    console.log("进入到:getSingleArtical");
    var responseDate = {};
    if (req.body.id)
    {
        try{
            var id = parseInt(req.body.id);
        }catch(err){
            console.log("id格式错误:"+err.message);
            return false;
        }
        var pool = api.getPool();
        pool.getConnection(function (err, conn) {
            if (err) {
                console.log("数据库连接失败:" + err);
                return false;
            }
            conn.query(sql.getSingleArtical, [id], function (err, result) {
                if (err) {console.log("getSingleArtical数据库查询语句出错:" + err);return false;}
                if (result[0]) {
                    responseDate.code = result;
                    responseDate.status = 0;
                }
                else {
                    responseDate.status = 1;
                    console.log("没查询到数据");
                }
                res.json(responseDate);
            });
            conn.release();
        })
    }
    else
    {
        console.log("Kong");
        responseDate.status=1;
        res.json(responseDate);
    }
});

    //获取单篇文章中关于作者的一些信息<artical>
router.post("/getSingleAuthorInfo",function(req,res){
    var responseDate={};
    if(req.body.blogId)
    {
        var blogId=parseInt(req.body.blogId);
        var reg=/^\d{1,6}$/g;
        if(!reg.test(""+blogId))
        {
            console.log("用户格式错误");
            return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.getSingleArticalUserIfo,[blogId],function(err,result){
                if(err){console.log("查询语句出错:"+err);return false;}
                if(result[0])
                {
                    responseDate.status=0;
                    responseDate.code=result;
                }
                else
                {
                    responseDate.status=1;
                    responseDate.code=0;
                    console.log("没有站到相关的用户信息");
                }
                res.json(responseDate);
            });
            conn.release();
        })
    }
    else
    {console.log("提交的内容为空");responseDate.status=1;res.json(responseDate);}
});

    //获取文章的评论<artical>
router.post("/getArticalComment",function(req,res){
    var responseDate={};
    if(req.body.articalId)
    {
        try{
            var page=api.getQuery(req.url);
        }catch(err)
        {
            console.log("参数错误:"+err);
            page=0;
        }
        var articalId=parseInt(req.body.articalId);
        var reg=/^\d{1,6}$/g;
        if(!reg.test(""+articalId))
        {
            console.log("文章的格式错误");
            return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("--数据库连接失败:"+err);return false;}
            conn.query(sql.getSingleArticalComment,[articalId,page],function(err,result){
                if(err){console.log("数据库连接失败:"+err);return false;}
                if(result[0])
                {
                    //console.log(JSON.stringify(result));
                    responseDate.status=0;
                    responseDate.code=result;
                }
                else
                {
                    console.log("没查到数据");
                    responseDate.code=[];
                    responseDate.status=1;
                }
                res.json(responseDate);
            });
            conn.release();
        });
    }
});

    //保存评论<artical>
router.post("/sendComment",function(req,res){
    var responseData={};
    if(req.body.token  && req.body.articalId && req.body.content)
    {
        var token=req.body.token;
        var articalId=parseInt(req.body.articalId);
        var content=req.body.content;
        var reg = /<[^>]*>|<\/[^>]*>/gm;
        content=content.replace(reg,"");
        var reg=/^\d{1,6}$/;
        if(!reg.test(""+articalId))
        {return false;console.log("文章id错误");}
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err); return false;}
            var userId=api.getUserId(token);
            var time=api.getNowTime();
            conn.query(sql.saveComment,[articalId,userId,content,time],function(err,result){
                if(err){console.log("saveComment查询语句出错:"+err);return false;}
                if(result.insertId)
                {
                    responseData.status=0;//保存成功
                    // console.log(JSON.stringify(result));
                    console.log("评论成功");
                }
                else
                {
                    responseData.status=1;//保存失败
                    console.log("保存评论失败");
                }
                conn.query(sql.getSingleArticalComment,[articalId,0],function(err,result){
                    if(err){console.log("数据库连接失败:"+err);return false;}
                    //console.log("很大"+JSON.stringify(result));
                    if(result[0])
                    {
                        responseData.code=result;
                    }
                    else
                    {
                        responseData.code=[];
                    }
                    res.json(responseData);
                });
            });
            conn.release();
        });
    }
});

    //所有专题<theme>
router.post("/category/:cate",function(req,res){
    var responseDate={};
        console.log("params:"+req.params.cate);
        //获取主页的部分专题信息
        if(req.params.cate=='theme')
        {
            var pool=api.getPool();
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败:"+err);return false;}
                conn.query(sql.getArticalTheme,function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                        responseDate.status=0;
                        responseDate.code=result;
                    }
                    else
                    {
                        responseDate.status=1;
                    }
                    res.json(responseDate);
                });
                conn.release();
            });
        }

        //根据页码显示专题
        if(req.params.cate=='allTheme')
        {
            try{
                var page=api.getQuery(req.url);
            }catch(err)
            {
                console.log("参数错误:"+err.message);
                return false;
            }
            var pool=api.getPool();
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败:"+err);return false;}
                conn.query(sql.getArticalAlltheme,[page],function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                        responseDate.status=0;
                        responseDate.code=result;
                    }
                    else
                    {
                        console.log("没有查到:"+result);
                        responseDate.status=1;
                    }
                    res.json(responseDate);
                });
                conn.release();
            });
        }
        //获取theme页面的所有专题信息
        if(req.params.cate=='entireTheme')
        {
            try{
                var userId=api.getUserId(req.body.token);
            }catch(err)
            {
                console.log("参数错误:"+err.message);
                return false;
            }
            var pool=api.getPool();
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败:"+err);return false;}
                conn.query(sql.getEntiretheme,function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                        responseDate.status=0;
                        responseDate.code=result;
                    }
                    else
                    {
                        console.log("没有查到:"+result);
                        responseDate.status=1;
                    }
                    res.json(responseDate);
                });
                conn.release();
            });
        }
});

    //单个专题的信息<category>
router.post("/getSingleCategoryInfo",function(req,res){
    var responseData={};
    if( req.body.categoryId)
    {
        var categoryId=parseInt(req.body.categoryId);
        var reg=/^\d{1,5}$/g;
        if(!reg.test(""+categoryId))
        {
            console.log("目录id不匹配");return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败："+err);return false;}
            conn.query(sql.getSingCategoryInfo,[categoryId],function(err,result){
                if(err){console.log("数据库查询语句出错:"+err);return false; }
                if(result[0])
                {
                    responseData.code=result;
                    responseData.status=0;
                }
                else
                {
                    responseData.status=1;
                    console.log("没查到数据");
                }
                res.json(responseData);
            });
            conn.release();
        })

    }
});

    //获取目录页面的专题<category>
router.post("/getSingleCategory",function(req,res) {
        var responseDate={};
        if( req.body.categoryId)
        {
            try{
                var page=api.getQuery(req.url);
            }catch(err)
            {
                console.log("参数错误:"+err.message);
            }
            var categoryId=parseInt(req.body.categoryId);
            var reg=/^\d{1,5}$/g;
            if(!reg.test(page))
            {
                console.log("页数格式错误");
                return false;
            }
            var reg=/^\d{1,5}$/g;
            if(!reg.test(""+categoryId))
            {
                console.log("目录格式错误");
                return false;
            }
            var pool=api.getPool();
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败:"+err);  return false;}
                conn.query(sql.getSingleCategoryArtical,[categoryId,page],function(err,result){
                    if(err){console.log("数据库连接失败:"+err); return false;}
                    if(result[0])
                    {
                        console.log();
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
});

    //推荐作者
router.post("/recommendAuthor",function(req,res){
        var responseDate={};
        try{
            var page=api.getQuery(req.url);
            var reg=/^\d{1,6}$/g;
            if(!reg.test(page))
            {
                console.log('参数格式错误');
                return false;
            }
        }catch(err)
        {
            console.log("参数错误:"+err.message);
            return false;
        }
        if(req.body.token)
        {
            //登录后推荐的，去除已经关注的
            var userId=api.getUserId(req.body.token);
            var pool=api.getPool();
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败"+err);return false;}
                console.log("0000000");
                conn.query(sql.recommendAuthor,[userId,page],function(err,result){
                    if(err){console.log("查询语句出错："+err);return false;}
                    if(result[0])
                    {
                        responseDate.status=0;
                        responseDate.code=result;
                    }
                    else
                    {
                        responseDate.status=1;//没查到
                    }

                    res.json(responseDate);
                });
                conn.release();
            })
        }
        else
        {
            //未登录推荐的作者
            var pool=api.getPool();
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败"+err);return false;}
                conn.query(sql.recommendAllAuthor,[page],function(err,result){
                    if(err){console.log("查询语句出错："+err);return false;}
                    if(result[0])
                    {
                        responseDate.status=0;
                        responseDate.code=result;
                    }
                    else
                    {
                        responseDate.status=1;//没查到
                    }
                    res.json(responseDate);
                    conn.release();
                })
            })
        }
});

    //举报文章
router.post('/report',function(req,res){

    if(req.body.token && req.body.content && req.body.blogId && req.body.type)
    {
        var responseData={};
        try{
            var token=req.body.token;
            var content=req.body.content;
            var blogId=req.body.blogId;
            var type=req.body.type;
            if(content.length>200) return false;
            var userId=api.getUserId(token);
        }catch(err){
            console.log(err.message);
            return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            //id,report,blog_id,content,type
            conn.query(sql.insertIntoReport,[userId,blogId,content,type],function(err,result){
                if(err){console.log("insertIntoReport查询语句出错:"+err);return false;}
                try{
                    result.insertId ? responseData.status=0:responseData.status=1;
                    res.json(responseData);
                }catch(err)
                {
                    console.log("result值错误:"+err);
                    return false;
                }
            });
            conn.release();
        })

    }
});

    //保存文章到blogCheck
router.post("/uploadartical",function(req,res){
    console.log("进入到保存文章");
    var responseDate={};
    // console.log(req.body);
    if( req.body.size && req.body.token && req.body.artical && req.body.title && req.body.category)
    {
        // console.log("a");
        try{

            var token=req.body.token;
            var userId=api.getUserId(token);
            var title=req.body.title.trim();
            var artical=req.body.artical;
            var category=req.body.category;
            var size=req.body.size;
            console.log("文章内容:"+artical);
            if(title.length>100)
            {
                console.log(" 标题太长");
                return false;
            }
            if(artical.length>30000)
            {
                console.log("文章太长了");
                return false;
            }
            var reg=/\d{1,2}/g;
            if(!reg.test(category))
            {
                console.log("文章类型错误");
                return false;
            }
        }catch(err)
        {
            console.log("-");
            return false;
        }

        // console.log("b");
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.getToken,[userId],function(err,result){
                if(err){console.log("查询语句连接出错:"+err);return false;}
                if(result.length<=0) return false;
                if(result[0].token)
                {
                    if(result[0].token==token)
                    {
                        var time=api.getNowTime();
                        //title,content,user_id,created_at,category_id
                        conn.query(sql.insetIntogetBlogCheck,[title,artical,userId,time,category,size],function(err,result){
                            if(err){console.log("查询语句出错:"+err);return false;}
                            if(result)
                            {
                                console.log("保存成功");
                                responseDate.status=0;
                            }
                            else
                            {
                                responseDate.status=1;
                                console.log("保存文章失败");
                            }
                            res.json(responseDate);
                        });
                    }
                    else
                    {
                        responseDate.status=6;//帐号在别的地方登录
                        res.json(responseDate);
                    }
                }
                else
                {
                    console.log(JSON.stringify(result));
                    res.json({"a":JSON.stringify(result)});
                }
                conn.release();
            });
        })
    }
    else
    {
        res.json({"code":"内容为空"});
    }
});









//-----------------
    //获取专题目录
router.post("/category",function(req,res){
    var responseDate={};
    var pool=api.getPool();
    pool.getConnection(function(err,conn){
        if(err){console.log("数据库连接失败:"+err);return false;}
        conn.query(sql.getArticalTheme,function(err,result){
            if(err){console.log("查询语句出错:"+err);return false;}
            if(result[0])
            {
                responseDate.status=0;
            }
            else
            {
                responseDate.status=1;
            }
            responseDate.code=result;
            res.json(responseDate);
        });
        conn.release();
    });
});


/*
router.post("/category/:cate",function(req,res){
    console.log("name的值为:"+req.body.name);
    var responseDate={};
    //证明该请求是来自简书的
    if(req.body.name=="jianshu")
    {
        console.log("params:"+req.params.cate);
        //获取主页的部分专题信息
        if(req.params.cate=='theme')
        {
            var pool=mysql.createPool(DBconfig.mysql);
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败:"+err);return false;}
                conn.query(sql.getArticalTheme,function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                        //console.log(JSON.stringify(result));
                        responseDate.status=0;
                        responseDate.code=result;
                    }
                    else
                    {
                        console.log("没有查到:"+result);
                        responseDate.status=1;
                    }
                    res.json(responseDate);
                    conn.release();
                });
            });
        }

        //获取theme页面的所有专题信息
        if(req.params.cate=='allTheme')
        {
            console.log("进入到");
            var pool=mysql.createPool(DBconfig.mysql);
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败:"+err);return false;}
                conn.query(sql.getArticalAlltheme,function(err,result){
                    if(err){console.log("查询语句出错:"+err);return false;}
                    if(result[0])
                    {
                       // console.log(JSON.stringify(result));
                        responseDate.status=0;
                        responseDate.code=result;
                    }
                    else
                    {
                        console.log("没有查到:"+result);
                        responseDate.status=1;
                    }
                    res.json(responseDate);
                    conn.release();
                });
            });
        }
    }

});
*/





//获取文章的详细信息
/*
router.post("/getArticalDetail",function(req,res){
    console.log("进入到getArticaldetail页面");
    if(req.body.name=="jianshu" && req.body.page)
    {
        var responseDate={};
        var page=req.body.page;
        var pool=mysql.createPool(DBconfig.mysql);
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.getArticalDetail,[page],function(err,result){
                console.log("artical");
                if(err){console.log("数据库查询语句出错:"+err); return false;}
                if(result[0])
                {
                    responseDate.code=result;
                    responseDate.status=0;
                    //console.log(JSON.stringify(result));
                }
                else
                {
                    responseDate.status=1;
                    console.log("没查询到数据");
                }
                res.json(responseDate);
                conn.release();
            });
        })

    }
});
*/

//获取推荐的作者 <home>
/*
router.post("/getRecommendAuthor",function(req,res){
    var responseDate={};
   if(req.body.name=="jianshu" && req.body.page)
   {
       console.log("进入到getRecommendAuthor");
       var page=parseInt(req.body.page);
       var pool=mysql.createPool(DBconfig.mysql);
       if(req.body.userId)
       {
           //登录后推荐的
           var userId=parseInt(req.body.userId);
           pool.getConnection(function(err,conn){
               if(err){console.log("数据库连接失败:"+err);return false;}
               conn.query(sql.recommendAuthorHomeLogin,[userId,page],function(err,result){
                   if(err){console.log("查询语句出错:"+err); return false;}
                   if(result[0])
                   {
                       responseDate.status=0;
                       responseDate.code=result;
                       console.log(JSON.stringify(result));
                   }
                   else{
                       responseDate.status=1;//没获取到数据
                   }
                   res.json(responseDate);
                   conn.release();
               });
           })

       }
       else
       {
           //未登录推荐的
           pool.getConnection(function(err,conn){
               if(err){console.log("数据库连接失败:"+err);return false;}
               conn.query(sql.recommendAuthorHome,[page],function(err,result){
                   if(err){console.log("查询语句出错:"+err); return false;}
                   if(result[0])
                   {
                       responseDate.status=0;
                       responseDate.code=result;
                       console.log(JSON.stringify(result));
                   }
                   else{
                       responseDate.status=1;//没获取到数据
                   }
                   res.json(responseDate);
                   conn.release();
               });
           })
       }

   }
});
*/

//获取单个文章的一些信息
/*
router.post("/getSingleArtical",function(req,res) {
    console.log("进入到:getSingleArtical");
    var responseDate = {};
    if (req.body.name == 'jianshu' && req.body.id)
    {
        var id = parseInt(req.body.id);
        var pool = mysql.createPool(DBconfig.mysql);
        pool.getConnection(function (err, conn) {
            if (err) {
                console.log("数据库连接失败:" + err);
                return false;
            }
            conn.query(sql.getSingleArtical, [id], function (err, result) {
                console.log("artical");
                if (err) {
                    console.log("数据库查询语句出错:" + err);
                    return false;
                }
                if (result[0]) {
                    responseDate.code = result;
                    responseDate.status = 0;
                    //console.log(JSON.stringify(result));
                }
                else {
                    responseDate.status = 1;
                    console.log("没查询到数据");
                }
                res.json(responseDate);
                conn.release();
            });
        })
    }
    else
    {
        console.log("Kong");
        responseDate.status=1;
        res.json(responseDate);
    }
});

//保存评论
router.post("/sendComment",function(req,res){
    console.log("sengComent");
    var responseDate={};
    if(req.body.token && req.body.name=="jianshu" && req.body.id && req.body.content)
    {
        var token=req.body.token;
        var articalId=parseInt(req.body.id);
        var content=req.body.content;
        var reg = /<[^>]*>|<\/[^>]*>/gm;
        content=content.replace(reg,"");
        console.log(content);
        var reg=/^\d{1,6}$/;
        if(!reg.test(articalId))
        {return false;console.log("文章id错误");}
        var pool=mysql.createPool(DBconfig.mysql);
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err); return false;}
            var tel=jwt.decode(token,'jianshu');
            var arr=tel.split(".");
            console.log(arr[0]);
            tel=arr[0];
            conn.query(sql.getUserId,[tel],function(err,result){
               if(err){console.log(err);return false;}
               if(result[0])
               {
                   console.log("查询到的用户:"+JSON.stringify(result));
                   var userId=result[0].userid;//要插入到评论表的用户id
                   var d = new Date();
                   var time = d.getFullYear() + "-" +(d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                   //blog_id,user_id,content,commented_at
                   conn.query(sql.saveComment,[articalId,userId,content,time],function(err,result){
                       if(err){console.log("查询语句出错:"+err);return false;}
                       if(result.insertId)
                       {
                           responseDate.status=0;//保存成功
                           console.log(JSON.stringify(result));
                           console.log("评论成功");
                       }
                       else
                       {
                           responseDate.status=1;//保存失败
                           console.log("保存评论失败");
                       }
                       conn.query(sql.getSingleArticalComment,[articalId],function(err,result){
                           if(err){console.log("数据库连接失败:"+err);return false;}
                           if(result[0])
                           {
                               console.log(JSON.stringify(result));
                               responseDate.code=result;
                           }
                           else
                           {
                               console.log("评论为空");
                           }
                           res.json(responseDate);
                       });
                   });

               }
               else
               {
                   console.log("没查到要添加评论的用户id");
               }
                conn.release();
            });
        });

    }
});

//推荐作者
router.post("/recommendAuthor",function(req,res){
    console.log("进入到recommendAuthor");
    var responseDate={};
    if(req.body.name=="jianshu")
    {
        var pool=mysql.createPool(DBconfig.mysql);
        if(req.body.userId)
        {
            //登录后推荐的，去除已经关注的
            var userId=parseInt(req.body.userId);
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败"+err);return false;}
                conn.query(sql.recommendAuthor,[userId],function(err,result){
                    if(err){console.log("查询语句出错："+err);return false;}
                    if(result[0])
                    {
                        console.log(JSON.stringify(result));
                        responseDate.status=0;
                        responseDate.code=result;
                    }
                    else
                    {
                        responseDate.status=1;//没查到
                    }
                    res.json(responseDate);
                    conn.release();
                })
            })
        }
        else
        {
            //未登录推荐的作者
            pool.getConnection(function(err,conn){
                if(err){console.log("数据库连接失败"+err);return false;}
                conn.query(sql.recommendAllAuthor,function(err,result){
                    if(err){console.log("查询语句出错："+err);return false;}
                    if(result[0])
                    {
                        console.log(JSON.stringify(result));
                        responseDate.status=0;
                        responseDate.code=result;
                    }
                    else
                    {
                        responseDate.status=1;//没查到
                    }
                    res.json(responseDate);
                    conn.release();
                })
            })


        }

    }
});
*/
module.exports=router;