/**
 * Created by Administrator on 2017/10/17.
 */
var express=require("express");
var router=express.Router();
var sql=require("../module/sql.js");

var mysql=require("mysql");

const api=require("../routes/api");

router.post("/getArtical",function(req,res){
    var responseDate={};
    console.log(JSON.stringify(req.body));
    if(req.body.token)
    {
        var token=req.body.token;
        try{
            var userId=api.getUserId(token);
            var page=api.getQuery(req.url);
            var reg=/^\d{1,6}$/g;
            if(!reg.test(page))
            {
                console.log("page格式错误:"+err);return false;
            }
        }catch(err)
        {
            console.log("token错误");
            return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库链接错误:"+err);return false;}
            page=page*10;
            page<0 ? page=0:page;
            conn.query(sql.getBlogCheck,[page],function (err,result){
                if(err){console.log("查询语句错:"+err);return false;}
                //console.log(JSON.stringify(result));
                if(result[0])
                {
                    responseDate.code=result;
                    responseDate.status=0;
                }
                else
                {
                    responseDate.status=1;
                }
                res.json(responseDate);
            });
            conn.release();
        })
    }
});

//还需校验用户，并非有token就可以提交
router.post("/saveArtical",function(req,res){
    var artical=req.body;
    if(!req.body.token) return false;
    // console.log(JSON.stringify(artical));
    var responseData={};
    try{
        var userId=api.getUserId(req.body.token);
    }
    catch(err)
    {
        console.log("token错误");
        return false;
    }
    var pool=api.getPool();
    pool.getConnection(function(err,conn){
        if(err){console.log("数据库连接失败:"+err);return false;}
        if(""+artical.checkFlag=='1')
        {
            //保存文章
            conn.query(sql.saveArtical,[artical.title,artical.content,artical.user_id,artical.created_at,artical.selected,artical.size],function(err,result){
                if(err){console.log("saveArtical数据路查询语句出错："+err);return false;}
                result ? responseData.status=0:responseData.status=1;
                console.log("文章保存成功");
            });
            //保存通知
            conn.query(sql.saveInform,[artical.user_id,artical.checkResult],function(err,result){
                if(err){console.log("saveInform数据路查询语句出错："+err);return false;}
                result ? responseData.status=0:responseData.status=1;
                console.log("消息发送成功");
            });
            //删除blogCheck的记录
            conn.query(sql.delBlogCheck,[artical.blog_id],function(err,result){
                if(err){console.log("delBlogCheck数据路查询语句出错："+err);return false;}
                result ? responseData.status=0:responseData.status=1;
                res.json(responseData);
                console.log("删除成功");
            });
        }
        if(""+artical.checkFlag=='2')
        {
            //保存通知
            var time=api.getNowTime();
            conn.query(sql.saveInform,[artical.user_id,artical.checkResult,time],function(err,result){
                if(err){console.log("saveInform数据路查询语句出错："+err);return false;}
                result ? responseData.status=0:responseData.status=1;
                console.log("消息发送成功");
            });
            //删除blogCheck的记录
            conn.query(sql.delBlogCheck,[artical.blog_id],function(err,result){
                if(err){console.log("delBlogCheck数据路查询语句出错："+err);return false;}
                result ? responseData.status=0:responseData.status=1;
                res.json(responseData);
                console.log("删除成功");
            });
        }
        conn.release();
    });

});
    //获取目录
router.post("/getCategory",function(req,res){
    var responseData={};
    if(!req.body.token) return false;
    try{
        var userId=api.getUserId(req.body.token);
    }
    catch(err)
    {
        console.log("token错误");
        return false;
    }
    var pool=api.getPool();
    pool.getConnection(function(err,conn){
        if(err){console.log("数据库连接失败:"+err);return false;}
        conn.query(sql.selectAllCategory,function(err,result){
            if(err){console.log("查询语句出错:"+err);return false;}
            if(result[0])
            {
                responseData.code=result;
                responseData.status=0;
            }else
            {
                responseData.status=1;
            }
            res.json(responseData);
        });
        conn.release();
    });
});

    //路由守卫
router.post("/enter",function(req,res){
    var responseData={};
    if(req.body.flag=='admin' && req.body.token)
    {
        try{
            var token=req.body.token;
            var userId=api.getUserId(token);
            var reg=/^\d{1,16}$/g;
            if(!reg.test(userId))
            {
                console.log("token格式错误");
                return false;
            }
        }catch(err)
        {
            console.log(err);
            return false;
        }
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.getUserInfoByUserId,[userId],function(err,result){
                if(err){console.log("getUserInfoByUserId数据库查询语句出错："+err);return false;}
                if(result[0])
                {
                    if(result[0].token==token)
                    {
                        responseData.status=0;
                        responseData.code='allow';
                        console.log("头肯匹配");
                    }
                    else
                    {
                        responseData.status=1;
                        responseData.code='forbidden';
                    }
                }
                res.json(responseData);
            });
            conn.release();
        })

    }
});

    //目录的添加与修改
router.post("/cateOpera/:who",function(req,res){
    console.log(JSON.stringify(req.body));
    var responseData={};
    if(req.params.who=='new' && req.body.token)
    {
        try{

            var userId=api.getToken(req.body.token);
            var cateName=req.body.categoryName.trim();
            var cateIntro=req.body.categoryIntroduce.trim();
            //过滤
            if(cateName=='' || cateIntro=='')
            {
                console.log("有数据为空");
                return false;
            }

        }catch(err)
        {
            console.log(err);
            return false;
        }

        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.insertIntoCategory,[cateName,cateIntro],function(err,result){
                if(err){console.log("查询语句出错:"+err);return false;}
                try{
                        result[0] ? responseData.status=0 :responseData.status=1;
                        responseData.code=result;
                        res.json(responseData);
                }catch(err){
                    console.log(err);return false;
                }
            });
            conn.release();
        })
    }
    if(req.params.who=='edit' && req.body.token)
    {

        try{
            var userId=api.getToken(req.body.token);
            var cateName=req.body.categoryName.trim();
            var categoryId=parseInt(req.body.categoryId);
            var cateIntro=req.body.categoryIntroduce.trim();
            //过滤
            if(cateName=='' || cateIntro=='')
            {
                console.log("有数据为空");
                return false;
            }
        }catch(err)
        {
            console.log("数据错误:"+err);
            return false;
        }

        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.updateCategory,[cateName,cateIntro,categoryId],function(err,result){
                if(err){console.log("查询语句出错:"+err);return false;}
                try{
                    result ? responseData.status=0 :responseData.status=1;
                    responseData.code=result;
                    res.json(responseData);
                }catch(err){
                    console.log(err);return false;
                }
            });
            conn.release();
        })

    }
    if(req.params.who=='editPhoto')
    {

    }
    if(req.params.who=='newPhoto')
    {


    }
});

    //获取举报
router.post("/report",function(req,res){
    var responseData={};
   if(req.body.token)
   {
       try{
            var userId=api.getUserId(req.body.token);
            var page=parseInt(api.getQuery(req.url));
            var reg=/^\d{1,8}$/g;
            if(!reg.test(""+page))
            {
                console.console.log("page格式错误");
                return false;
            }
       }catch(err)
       {
           console.log(err);
           return false;
       }
       var pool=api.getPool();
       pool.getConnection(function(err,conn){
           if(err){console.log("数据库连接失败:"+err); return false;}
           page=page*15;
           conn.query(sql.selectReport,[page],function (err,result) {
               if(err){console.log("selectReport数据库查询语句出错:"+err); return false;}
               result[0] ? responseData.status=0 :responseData.status=1;
               responseData.code=result;
               res.json(responseData);
           });
           conn.release();

       })

   }
});
    //删除举报
router.post("/report",function(req,res){
    var responseData={};
   if(req.body.token && req.body.reportId && req.body.content)
   {
       try{
            var userId=api.getUserId(req.body.token);
            var Id=parseInt(req.body.reportId);
            var reg=/^\d{1,8}$/g;
            if(!reg.test(""+userId))
            {
                console.console.log("page格式错误");
                return false;
            }
           var reg=/^\d{1,8}$/g;
           if(!reg.test(""+Id))
           {
               console.console.log("page格式错误");
               return false;
           }
           var content=req.body.content.trim;
           if(content.length>300 || content.length==0 || content==undefined)
           {
               console.log("conntent错误");
               return false;
           }
       }catch(err)
       {
           console.log(err);
           return false;
       }
       var pool=api.getPool();
       pool.getConnection(function(err,conn){
           if(err){console.log("数据库连接失败:"+err); return false;}
           conn.query(sql.selectReportTitle,[Id],function(err,result){
               if(err){console.log("selectReport数据库查询语句出错:"+err); return false;}
               try{
                   if(result[0])
                   {
                       var time=api.getNowTime();
                       responseData.status=0;
                       var title=result[0].title;
                       var report=result[0].report;
                       //userid,content,time
                       content+='[您监督的文章'+title+']';
                       conn.query(sql.saveInform,[report,content,time],function(err,result){
                            if(err){console.log("selectReport数据库查询语句出错:"+err); return false;}

                            conn.query(sql.deleteReport,[Id],function (err,result) {
                               try{
                                   if(err){console.log("selectReport数据库查询语句出错:"+err); return false;}
                                   result[0] ? responseData.status=0 :responseData.status=1;
                                   responseData.code=result;
                                   res.json(responseData);
                               }catch(err)
                               {
                                   console.log(err);
                               }

                           });

                       })
                   }else
                   {
                   }





                   res.json(responseData);
               }catch(err)
               {
                   console.log(err);
               }

           });
           conn.release();
       })

   }
});
module.exports=router;