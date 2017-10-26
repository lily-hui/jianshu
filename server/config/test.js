/**
 * Created by Administrator on 2017/9/22.
 */
var crypto=require("crypto");
const hash = crypto.createHash('md5');
var pwd="ddaddadasdewe";
hash.update(pwd);
var a=hash.digest("hex")
console.log(a);
console.log("aaa");
//194ce5d0b89c47ff6b30bfb491f9dc26
//89defae676abd3e3a42b41df17c40096