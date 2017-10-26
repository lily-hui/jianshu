import { Injectable } from '@angular/core';
import {Http,Headers,URLSearchParams} from "@angular/http";
import "rxjs/add/operator/map";
@Injectable()
export class GetArticalService{

  constructor(private http:Http){}
  webUrl:string='http://localhost:3000/';

  //带参数
  search(data,url,page){
    //设置请求头
    var headers=new Headers();
    headers.append("Content-Type",'application/json');
    //设置参数
    var query=new URLSearchParams();
    query.set('page',page);
    return this.http.post(this.webUrl+url,data,{headers:headers,params:query})
      .map(res=>res.json());
  }







  url="http://localhost:3000";

  //获取主题目录信息
  get_theme(val,url){
    // var data=JSON.stringify(val);
    var headers=new Headers();
    headers.append("Content-Type","application/json");
    return this.http.post(this.url+"/home/category/"+url,val,{headers:headers})
      .map(
        res=>res.json()
      );
  }

  //提交文章内容
  uploadArtical(data){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/home/uploadartical",data,{headers:headers})
     .map(res=>res.json());
  }

  //获取文章内容
  getArticalDetail(data){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/home/getArticalDetail",data,{headers:headers})
      .map(res=>res.json());
  }

  //获取推荐作者
  getRecommendAuthor(data){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/home/getRecommendAuthor",data,{headers:headers})
      .map(res=>res.json());
  }

  //获取单个文章的信息
  getSingleArtical(data){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/home/getSingleArtical",data,{headers:headers})
      .map(res=>res.json());
  }
  //发送评论
  sendComment(data){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/home/sendComment",data,{headers:headers})
      .map(res=>res.json());
  }

  //获取每篇文章的作者详细信息
  getSingleAuthorInfo(data){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/home/getSingleAuthorInfo",data,{headers:headers})
      .map(res=>res.json());
  }

  //获取文章的评论
  getArticalComment(data){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/home/getArticalComment",data,{headers:headers})
      .map(res=>res.json());
  }

  //推荐作者
   recommendAuthor(data){
     var headers=new Headers({"Content-Type":"application/json"});
     return this.http.post(this.url+"/home/recommendAuthor",data,{headers:headers})
       .map(res=>res.json());
   }

   //获取每个目录的详细信息
  getSingleCategoryInfo(data){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/artical/getSingleCategoryInfo",data,{headers:headers})
      .map(res=>res.json());
  }

  //获取单个目录的文章信息
  getSingleCategoryArtical(data,url){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/home/getSingleCategory/"+url,data,{headers:headers})
      .map(res=>res.json());
  }

  //根据7天和30天获取文章
   getTimerArtical(data){
     var headers=new Headers({"Content-Type":"application/json"});
     return this.http.post(this.url+"/personal/getTimerArtical",data,{headers:headers})
       .map(res=>res.json());
   }

  //------------------个人中心页面-------------------

/*  //获取个人中心自己所写的文章
  getPersonalCenterBlog(data,url){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/personal/getPersonalCenterInfo/"+url,data,{headers:headers})
      .map(res=>res.json());
  }*/

  //获取个人中心自己所写的文章
  getPersonalCenterInfo(data,url){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/personal/getPersonalCenterInfo/"+url,data,{headers:headers})
      .map(res=>res.json());
  }

  //获取个人中心关注的作者
  personalConcrenSearch(data){
    var headers =new Headers();
    headers.append("Content-Type","application/json");
    return this.http.post(this.url+"/personal/personalConcrenSearch",data,{headers:headers})
      .map(res=>res.json());
  }
  //获取个人中心喜欢的文章
  personalLikeArtical(data){
    var headers =new Headers();
    headers.append("Content-Type","application/json");
    return this.http.post(this.url+"/personal/personalLikeArtical",data,{headers:headers})
      .map(res=>res.json());
  }


  //-----------------------concern页面----------
  //获取用户关注的所有作者所写的所有文章
  getConcrenAuthorAllArtical(data,url){
    var headers=new Headers({"Content-Type":"application/json"});
    return this.http.post(this.url+"/personal/getConcrenAuthor/"+url,data,{headers:headers})
      .map(res=>res.json());
  }






}

