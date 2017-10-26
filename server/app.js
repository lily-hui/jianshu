var express = require('express');
var path = require('path');//原生模块
var favicon = require('serve-favicon');

var swig=require("swig");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
swig.setDefaults({cache:false});
var app = express();

// view engine setup
app.engine("html",swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","http://localhost:4200");
    res.header('Access-Control-Allow-Credentials',true);
    res.header("Access-Control-Allow-Headers", "Content-Type,Accept,X-Requested-With,author");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Content-Type", "application/x-www-form-urlencoded");//返回什么类型的数据
    res.header("Content-Type","multiparty/form-data");
    res.header("Content-Type","text/html");

    console.log("要访问的地址是："+req.url);
    //console.log(req.query);获取提交的参数
    //console.log(res);
    if(req.method=="OPTIONS")
    {
        res.json({status:200});
    }
    else
    {
        next();
    }

});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/admin",require("./routes/admin"));

app.use("/home",require("./routes/home"));

app.use("/personal",require("./routes/personal"));

app.use("/artical",require("./routes/artical"));

app.use("/manger",require("./routes/manger"));

//-----------------测试专用-------------------
app.use("/test",require("./routes/test"));

//用于测试跨域以及angular2获取该数据
app.use("/json",function(req,res,next){
  res.json([
      {"id":"2001","name":"Elymi","password":"123456"},
      {"id":"3002","name":"MAyun","password":"1243242"},
      {"id":"4003","name":"Tom","password":"1233222"},
      {"id":"5004","name":"John","password":"144444"},
      {"id":"6005","name":"mary","password":"126666"}
  ]);
});


app.use('/',function(req,res){
   // res.render('index');
    console.log("index");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
