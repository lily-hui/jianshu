import { Component, OnInit } from '@angular/core';
import {LoginService} from "../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[LoginService]
})
export class RegisterComponent {

  password;
  errPasswordShow:boolean;
  errPasswordContent:string;

  repassword;
  errrePasswordShow:boolean;
  errrePasswordContent:string;

  telephone;
  errTelephoneShow:boolean;
  errTelephoneContent;

  nickname;
  errNickShow:boolean;
  errNickContent:string;

  responseData;

  checkTel(tel)
  {
    console.log(tel);
    if(tel)
    {
      var reg=/^\d{11}$/g;
      if(!reg.test(tel))
      {
        this.errTelephoneContent="手机号码格式错误";
        this.errTelephoneShow=true;
        return false;
      }
    }
    else
    {
      this.errTelephoneContent="手机号码不能为空";
      this.errTelephoneShow=true;
      return false;
    }
    this.errTelephoneContent="";
    this.errTelephoneShow=false;
    return true;//正确
  }

  checkPassword(password)
  {
    //console.log(password);
    if(password)
    {//有密码的时候
      var reg=/^\w{6,16}$/g;
      if(!reg.test(password))
      {
        this.errPasswordContent="密码由6-16位字母和数字组成";
        this.errPasswordShow=true;
        return false;
      }
    }
    if(!password)
    {//密码为空的时候
      this.errPasswordContent="密码不能为空";
      this.errPasswordShow=true;
      return false;
    }
    this.errPasswordContent="";
    this.errPasswordShow=false;
    return true;//都正确的时候
  }

  checkNick(nick)
  {
   // console.log("nick:"+nick);
    if(nick)
    {
      var reg=/^((?=[\x21-\x7e]+)[^A-Za-z0-9])$/;
      if(reg.test(nick))
      {
        this.errNickContent="昵称由字母，数字，汉字组成";
        this.errNickShow=true;
        return false;
      }
    }
    if(!nick)
    {
      this.errNickContent="昵称不能为空";
      this.errNickShow=true;
      return false;
    }
    this.errNickShow=false;
    this.errNickContent='';
    return true;
  }

  checkrePassword(repassword){
      if(repassword!=this.password)
      {
        this.errrePasswordContent="两次输入的密码不一致";
        this.errrePasswordShow=true;
        return false;
      }
      if(!repassword)
      {
        this.errrePasswordContent="密码不能为空";
        this.errrePasswordShow=true;
        return false;
      }
    this.errrePasswordContent="";
    this.errrePasswordShow=false;
    return true;
  }

  toRegister(val){

    var tel=this.checkTel(val.telephone);
    var nick=this.checkNick(val.nickname);
    var pwd=this.checkPassword(val.password);
    var repwd=this.checkrePassword(val.repassword);
    var that=this;
    if(tel && pwd && nick && repwd)
    {
      this.login.funLogin(val,'admin/register')
        .subscribe(
          (data)=>{
            this.responseData=data;
            switch(""+data.status)
            {
              case "0":
                sessionStorage.setItem("token",data.token);
                sessionStorage.setItem("head",data.head);
                sessionStorage.setItem("userId",data.userId);
                that.route.navigate(['']);
                break;
              case "6":
                that.errTelephoneShow=true;
                that.errTelephoneContent="该手机号已经注册";
                break;
              case "7":
                that.errTelephoneShow=true;
                that.errTelephoneContent="该手机号已经注册";
            }
          }
        );

    }
  }


  constructor(
    // private glo: GlobalPropertyService
    private login:LoginService,
    private route:Router,
  ) { }

  ngOnInit() {
  }
  ngOnDestroy() {

  }
}
