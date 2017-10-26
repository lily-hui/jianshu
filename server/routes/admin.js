/**
 * Created by Administrator on 2017/9/21.
 */

//用户注册，登录，信息的修改,完善
var express=require("express");
var router=express.Router();
// var mysql=require("mysql");
var sql=require("../module/sql.js");
var fs=require("fs");
var path=require("path");
var multiparty=require("multiparty");
const api=require("../routes/api");

//登录
router.post("/login",function(req,res){
    var responseData={};
    if(req.body.telephone && req.body.password)
    {
        var telephone= req.body.telephone.trim();
        var password= req.body.password.trim();
        var reg=/^\d{11}$/g;
        if(!reg.test(telephone))
        {
            responseData.status=1;//电话号码格式错误
            res.json(responseData);
            return false;
        }
        var reg=/^\d{6,16}$/g;
        if(!reg.test(password))
        {
            responseData.status=2;//密码格式错误
            res.json(responseData);
            return false;
        }
        var pool=api.getPool();

        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err); return false}
            conn.query(sql.getUserInfo,[telephone],function(err,result){
                if(err){console.log("查询语句出错:"+err); return false;}

                if(result[0])
                {
                    var headPhoto=result[0].head;
                    var userId=result[0].userid;
                    var flag=result[0].flag;
                    //产生token
                    var token=api.getToken(userId);
                    //加密密码
                    var pwd=api.encodePassword(password);
                    if(pwd==result[0].password)
                    {
                        if(result[0].head===undefined)
                        {
                            responseData.head="888888.jpg";
                        }
                        conn.query(sql.updateToken,[token,telephone],function(err,result){
                            if(err){console.log("查询语句出错:"+err); return false;}
                            if(result){
                                responseData.status=0;
                                responseData.token=token;
                                responseData.head= headPhoto;
                                responseData.userId=userId;
                                responseData.flag=flag;
                                res.json(responseData);
                            }
                            else
                            {
                                console.log("登录失败");
                            }
                        });
                    }
                    else
                    {
                        responseData.status=4;
                        res.json(responseData);
                    }
                }
                else
                {
                    responseData.status=4;
                    res.json(responseData);
                }
            });
            conn.release();
        });
        //这里结束吗？
    }
    else
    {
        responseData.status=5;
        res.json(responseData);//手机号和密码不能为空
    }
});

//注册
router.post("/register",function(req,res){
    var responseData={};
    if(req.body.nickname && req.body.telephone && req.body.password && req.body.repassword)
    {
        var tel=req.body.telephone.trim();
        var nick=req.body.nickname.trim();
        var password=req.body.password.trim();
        var repassword=req.body.repassword.trim();
        var reg=/^\d{11}$/g;
        if(!reg.test(tel))
        { responseData.status=1;res.json(responseData);return false;}
        var reg=/^((?=[\x21-\x7e]+)[^A-Za-z0-9])$/;
        if(reg.test(nick))
        {responseData.status=3; res.json(responseData);return false;}
        var reg=/^\w{6,16}$/g;
        if(!reg.test(password))
        {responseData.status=2; res.json(responseData);return false; }
        if(password!=repassword)
        { responseData.status=4;res.json(responseData);return false;}
        //数据过滤完

        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err) {console.log(err+"数据库连接失败");return false;}
            conn.query(sql.getUserId,[tel],function(err,result){
                if(err){console.log("查询语句出错:"+err);return false;}
                if(result[0])
                {
                    //该电话已经注册
                    responseData.status=6;
                    res.json(responseData);
                    return false;
                }
                else
                {   //没注册
                    var time=api.getNowTime();
                    var pwd=api.encodePassword(password);
                    //由于是根据用户id产生的token，故需在后续获得id后更新tokan
                    var token='5555';
                    conn.query(sql.insertUser,[nick,tel,pwd,time,token],function(err,result){
                        if(result.insertId)
                        {
                            responseData.status=0;
                            responseData.head="888888.jpg";
                            var userId=result.insertId;
                            responseData.userId=userId;
                            var token=api.getToken(userId);

                            conn.query(sql.updateToken,[token,tel],function(err,result){
                                if(err){console.log("查询语句出错:"+err);return false;}
                                if(result) responseData.token=token;
                                res.json(responseData);
                            });
                        }
                        else
                        {
                            responseData.status=7;
                            res.json(responseData);
                        }
                    })
                }
            });
            conn.release();
        });
    }
    else
    {
        responseData.status=5;
        res.json(responseData);
    }

});

//记住密码登录
router.post("/rememberLogin",function(req,res){
    if(req.body.token)
    {
        var token=req.body.token;
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            var responseDate={};
            if(err){console.log("数据库连接失败"+err);return false;}
            var userId=api.getUserId(token);
            conn.query(sql.getToken,[userId],function(err,result){
                if(err){console.log("查询语句出错:"+err);return false;}
                if(result[0])
                {
                    if(token==result[0].token)
                    {
                        responseDate.status=0;
                        responseDate.token=token;
                        responseDate.userId=result[0].userid;
                        responseDate.head=result[0].head;
                    }
                    else{console.log("token不匹配");responseDate.status=1;}
                    // console.log("记住密码登录要发送给前台的数据："+JSON.stringify(responseDate));
                    res.json(responseDate);
                }
                else
                {
                    console.log("没查到该号码的token");
                    responseDate.status=1;//记住密码登录失败
                    res.json(responseDate);
                }
            });
            conn.release();
        })
    }
    else
    {
        console.log("提交的token为空");
    }
});

//退出
router.post("/logOff",function(req,res){
    var responseDate={};
    if(req.body.token)
    {
        var token=req.body.token;
        var userId=api.getUserId(token);
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.updateTokenByUserId,[userId],function(err,result){
                if(err){console.log("查询语句出错:"+err);return false;}
                if(result)
                {
                    responseDate.satus=0;
                    res.json(responseDate);
                }
            });
            conn.release();
        })
    }
    else{console.log("token为空:"+req.body.token);}
});


//信息的完善
router.post("/perfect/:who",function(req,res){
        var responseData={};
        //基础信息
        if(req.params.who=='info')
        {
            if(req.body.nickname && req.body.email && req.body.token && req.body.introduce && req.body.sex && req.body.webUrl)
            {
                try{
                    var email=req.body.email.trim();
                    var nick=req.body.nickname;
                    var introduce=req.body.introduce;
                    var token=req.body.token;
                    var weburl=req.body.webUrl;
                    var sex=parseInt(req.body.sex);
                    var userId=api.getUserId(token);
                    if(sex!=1 && sex!=2 && sex!=3)
                    {
                        responseData.status=1;//性别错误
                        res.json(responseData);
                        return false;
                    }
                    introduce=introduce.replace(/[\r\n]+/g,"");
                    if(introduce.length>300)
                    {
                        responseData.status=1;//介绍内容太长
                        res.json(responseData);
                        return false;
                    }
                    var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
                    if(!reg.test(weburl))
                    {
                        responseData.status=2;//网址不匹配
                        res.json(responseData);
                        return false;
                    }
                    //使用正则对数据进行判断
                    var reg=/^((?=[\x21-\x7e]+)[^A-Za-z0-9])/;
                    if(reg.test(nick))
                    {
                        console.log("nick的值为:"+nick);
                        responseData.status=2;//昵称格式错误
                        res.json(responseData);
                        return false;
                    }
                    var reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/g;
                    if(!reg.test(email))
                    {
                        responseData.status=3;//邮箱格式错误
                        res.json(responseData);
                        return false;
                    }

                }catch(err)
                {
                    console.log("err"+err.message);
                    res.status(500);
                    return false;
                }

                var pool=api.getPool();
                pool.getConnection(function(err,conn){
                    if(err){console.log("数据库连接失败"+err);return false;}
                    //update user set nickname=?,email=?,introduce=?,sex=?,weburl=? where userid=?',
                    conn.query(sql.updateUserInfo,[nick,email,introduce,sex,weburl,userId],function(err,result){
                        if(err){console.log("查询语句出错:"+err); return false;}
                        if(result)
                        {
                            responseData.status=0;
                        }
                        else
                        {
                            responseData.status=1;
                        }
                        res.json(responseData);
                    });
                    conn.release();
                });

            }
            else
            {
                console.log("数据为空");
                responseData.status=1;//提交的数据为空
            }
        }


        //上传文件
        if(req.params.who=="upfile")
        {
            // console.log("-----------111------------");

            var form=new multiparty.Form();
            var dir=path.join(__dirname,"../public/upfile");
            console.log(dir);
            form.uploadDir=dir;
            //console.log("配置的目录:"+form.uploadDir);
            form.parse(req,function(err,filed,file){
                try{

                    if(err){
                        //console.log("上传文件失败"+err);
                        responseData.status=1;
                        res.json(responseData);
                        return false;
                    }
                    //console.log(file);
                    var tempName=file.photo[0].path.split("\\");
                    var oldName=path.join(dir,tempName[tempName.length-1]);
                    //console.log(oldName);
                    var type=oldName.split(".");
                    type=type[type.length-1].toLowerCase();
                    var size=file.photo[0].size;
                    // console.log(type);

                    // console.log("-----------222------------");

                    if(type!="jpg" && type=="jpeg" && type=="png")
                    {
                        responseData.status=2;//格式错误
                        res.json(responseData);
                        return false;
                    }

                    if(parseInt(size)>6291456)
                    {
                        // console.log(size);
                        responseData.status=3;
                        res.json(responseData);
                        return false;
                    }

                    // console.log("-----------------------");
                    var time=new Date().getTime();
                    var newName=path.join(dir,time+"."+type);


                }catch(err){
                    console.log(err);
                    return false;
                }

                fs.rename(oldName,newName,function(err){
                    if(err)
                    {console.log(err);
                        responseData.status=4;//重命名错错误
                        res.json(responseData);
                        return false;
                    }
                    else
                    {
                        //console.log("更名成功");
                        var pool=api.getPool();
                        pool.getConnection(function (err,conn) {
                            if(err){console.log("数据库连接失败"+err);return false;}
                            var token=req.headers.author;
                            var userId=api.getUserId(token);
                            conn.query(sql.selectHeader,[userId],function(err,result){
                                if(err){console.log("查询语句出错:"+err);return false;}
                                if(result[0])
                                {
                                    var oldHead=result[0].head;//数据库的中的头像
                                    var del=oldHead;//要删除的头像
                                    oldHead=path.join(dir,oldHead);
                                    if(del!=="888888.jpg")
                                    {
                                        console.log("要删除的图片"+oldHead);
                                        fs.unlink(oldHead,function (err) {
                                            if(err) {console.log("删除失败:"+err);}
                                            console.log('删除成功')}
                                        )
                                    }
                                }

                                var headPhoto=time+"."+type;
                                console.log("要插入的图片的地址:"+headPhoto);
                                conn.query(sql.insertHead,[headPhoto,userId],function(err,result){
                                    if(err){console.log("查询语句出错:"+err);return false;}
                                    if(result)
                                    {
                                        responseData.status=0;
                                        responseData.head=headPhoto;
                                        console.log("完善信息要返回的数据:"+JSON.stringify(responseData));
                                        res.json(responseData);
                                    }
                                });
                            });
                            conn.release();
                        })
                    }
                });
            });
        }
    });

router.post('/getUserInfo',function(req,res){
    var responseData={};
    console.log(req.body.token);
    if(req.body.token)
    {
        try{
            var userId=api.getUserId(req.body.token);
        }catch(err){console.log(err);}
        var pool=api.getPool();
        pool.getConnection(function(err,conn){
            if(err){console.log("数据库连接失败:"+err);return false;}
            conn.query(sql.getSomeUserInfo,[userId],function(err,result){
                if(err){console.log("getSomeUserInfo查询语句出错:"+err);return false;}
                try{
                    if(result[0])
                    {
                        responseData.status=0;
                        responseData.code=result;
                    }
                    else
                    {
                        responseData.sstatus=1;
                    }
                    res.json(responseData);
                }catch(err){}
            });
            conn.release();
        })
    }
});

module.exports=router;