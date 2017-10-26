import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoginService} from "../services/login.service";
import {Router} from "@angular/router";
import {GlobalService} from "../services/global.service";
// import {LocationStrategy} from "@angular/common";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[LoginService,GlobalService]
  //Router该模块不需要注入
  //注意that
})
export class LoginComponent {
  remember:Boolean=false;//记住密码复选框

  password;
  telephone;

  errPasswordShow:Boolean;
  errTelephoneShow:Boolean;

  errPasswordContent:string;
  errTelephoneContent:string;

  responseData;
  constructor(
    private login:LoginService,
    private route:Router,
    // private global:GlobalService
  ) { }

  checkTel(tel)
  {
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
    if(!tel)
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
    {
      var reg=/^\w{6,16}$/g;
      if(!reg.test(password))
      {
        this.errPasswordContent="密码由6-16位字母和数字组成";
        this.errPasswordShow=true;
        return false;
      }
    }
    if(!password)
    {
      this.errPasswordContent="密码不能为空";
      this.errPasswordShow=true;
      return false;
    }
    this.errPasswordContent="";
    this.errPasswordShow=false;
    return true;//都正确的时候
  }

  tologin(val){

    var that=this;
    var tel=this.checkTel(val.telephone);
    var pwd=this.checkPassword(val.password);


    if(tel && pwd)
    {
      this.login.funLogin(val,"admin/login")
       .subscribe(
         (data)=>{
           this.responseData=data;
           switch(""+data.status)
           {
             case "0":
               if(that.remember)
               {
                 localStorage.setItem("token",data.token);
                 localStorage.setItem("remember",'true')
               }
               sessionStorage.setItem("token",data.token);
               sessionStorage.setItem("head",data.head);
               sessionStorage.setItem("userId",data.userId);
               sessionStorage.setItem("flag",data.flag);
               that.route.navigate(['']);
                  // that.route.navigateByUrl('');
               break;
             case "4":
               this.errPasswordShow=true;
               this.errPasswordContent="密码错误";
               break;
           }
         }
       );

    }
  }


  ngOnInit() {
    this.errPasswordShow=false;
    this.errTelephoneShow=false;
    console.log(GlobalService);
  }

}
