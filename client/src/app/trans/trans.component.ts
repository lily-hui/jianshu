import {Component, OnInit, OnDestroy,AfterContentChecked} from '@angular/core';
import {LoginService} from "../services/login.service";
import {OperatorService} from "../services/opeartor.service";
import {Router} from "@angular/router";
declare var $;

@Component({
  selector: 'trans',
  templateUrl: './trans.component.html',
  styleUrls: ['./trans.component.css'],
  providers:[LoginService,]
})
export class TransComponent implements OnInit,OnDestroy,AfterContentChecked{


  webUrl=this.operator.webUrl;
  personalHead:string;//头像
  userId:number;//到个人中心需要用到的userId
  navbarHidden:boolean=true;//隐藏整个导航条
  hiddenNavs: boolean=false;//隐藏登录状态

  searchContent;
  showSelect:boolean=false;
  alertHidden:boolean=false;
  flag:boolean=false;
  constructor(
    private login:LoginService,
    private route:Router,
    private operator:OperatorService
  ) {}

  //个人信息下拉框的显示与隐藏
  funcShowSelect(){
    this.showSelect=true;
  }
  funcHiden(){
    this.showSelect=false;
  }

  ngOnInit() {
    //注册jquery事件
    this.hiddenNavs = Boolean(sessionStorage.getItem("token"));
    this.navbarHidden=true;
    this.alertHidden=false;
    var admin=sessionStorage.getItem("flag");
    (admin=='admin') ? this.flag=true :  this.flag=false;

    //头像由于是一个变量当页面一刷新，变量就重新初始化，导致头像不显示。
    this.personalHead=sessionStorage.getItem("head");//显示头像
    this.userId=parseInt(sessionStorage.getItem("userId"));

    //记住密码登录
    if(sessionStorage.getItem("token")){
        console.log("已经登录");
    }
    else
    {
      if(localStorage.getItem("remember") && localStorage.getItem("token"))
      {
        var that=this;
        var token=localStorage.getItem("token");
        var data=JSON.stringify({token:token});
        this.login.funLogin(data,'admin/rememberLogin')
          .subscribe(
            (data)=>{
              switch(""+data.status)
              {
                case "0":
                  sessionStorage.setItem("token",data.token);
                  sessionStorage.setItem("head",data.head);
                  sessionStorage.setItem("userId",data.userId);
                  that.personalHead=data.head;
                  break;
                case "1":
              }
            }
          );
      }
    }
  }

  //退出
  log_out() {
    if (sessionStorage.getItem("token")) {
      var token=sessionStorage.getItem("token");
      var data=JSON.stringify({token:token});
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("head");
      sessionStorage.removeItem("flag");
      this.login.funLogin(data,'admin/logOff').subscribe(
        (data)=>{
          this.route.navigate(['']);
        }
      );
    }
    else
    {
      console.log("session为空");
    }
  }

  //警告框的显示与隐藏
  showAlert(){
    this.alertHidden=true;
  }

  //获取搜索内容搜索
  funGetSearch(val){
    var search=val.trim();
    this.searchContent=search;
    if(search)
    {
      this.route.navigate(['../search',this.searchContent])
    }
  }

  funLinkToPersonal(){
    if(sessionStorage.getItem("userId"))
    {
      var userId=sessionStorage.getItem("userId");
      this.route.navigate(['./PersonalCenter',userId]);
    }
    else
    {
      this.route.navigate(['/PersonalCenter',]);
    }
  }

  ngAfterContentChecked(){
    this.personalHead=sessionStorage.getItem("head");
    this.hiddenNavs = Boolean(sessionStorage.getItem("token"));
  }
  ngOnDestroy() {
  }


}


