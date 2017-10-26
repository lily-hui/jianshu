import { Injectable } from '@angular/core';
import {Http,Headers} from "@angular/http";
import "rxjs/add/operator/map";
declare var $;
@Injectable()
export class OperatorService {
  url="http://localhost:3000/artical/";

  webUrl="http://localhost:3000/";
  constructor(
    private http:Http
  ){}

  //回到顶部
  funGoToTop(element){
        $(window).scroll(function(){
          if($(window).scrollTop()>300)
          {
            $(element).show();
          }
          else
          {
            $(element).hide();
          }
        });

        $(element).click(function(){
          $("html,body").animate({scrollTop:0},500);
        })
  }

  //关注的添加与取消关注
  sumitData(data,url){
    var headers=new Headers();
    headers.append("Content-Type",'application/json');
    return this.http.post(this.webUrl+url,data,{headers:headers})
      .map(res=>res.json());
  }


//-----------------文章页面----------------
  //添加关注
  addFollow(data){
      var headers =new Headers();
      headers.append("Content-Type","application/json");
      return this.http.post(this.url+"addFollow",data,{headers:headers}).map(res=>res.json());
  }
  //添加喜欢
  addLike(data){
    var headers =new Headers();
    headers.append("Content-Type","application/json");
    return this.http.post(this.url+"addLike",data,{headers:headers}).map(res=>res.json());
  }
  //查看当前用户与本本文章关注与喜欢的关系。
  searchArticalLikeConcern(data){
    var headers=new Headers();
    headers.append("Content-Type","application/json");
    return this.http.post(this.url+"searchArticalLikeConcern",data,{headers:headers})
      .map(res=>res.json());
  }

  //-------------------------------搜索页面
  //搜索相关用户
  searchUser(data,url){
    var headers =new Headers();
    headers.append("Content-Type","application/json");
    return this.http.post(this.url+"search/"+url,data,{headers:headers})
      .map(res=>res.json());
  }



}
