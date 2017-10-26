import { Injectable } from '@angular/core';
import {Http,Headers} from "@angular/http";
import "rxjs/add/operator/map";
@Injectable()
export class LoginService{
  url="http://localhost:3000";
  webUrl='http://localhost:3000/';
  constructor(private http:Http){}

  //登录，注册，记住密码登录，退出
  funLogin(data,url){
    var headers=new Headers();
    headers.append("Content-Type",'application/json');
    return this.http.post(this.webUrl+url,data,{headers:headers})
            .map(res=>res.json());
  }


  //完善信息
  perfect(val,url)
  {
    var data=JSON.stringify(val);
    var headers=new Headers();
    headers.append("Content-Type","application/json");
    return  this.http.post(this.url+"/admin/perfect/"+url,data,{headers:headers})
      .map(res=>res.json());
  }


  //获取个人关注的作者
  getConcrenAuthor(data,url){
    var headers=new Headers();
    headers.append("Content-Type","application/json");
    return  this.http.post(this.url+"/personal/getConcrenAuthor/"+url,data,{headers:headers})
      .map(res=>res.json());
  }

}

