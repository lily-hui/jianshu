import { Component, OnInit } from '@angular/core';

// import {LoginService} from "../services/login.service";

import {GetArticalService} from "../../services/getartical.service";
import {FilterPipe} from "../filter.pipe";
import {OperatorService} from "../../services/opeartor.service";
import {Router} from "@angular/router";
import {GlobalService} from "../../services/global.service";
 declare  var $;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[GetArticalService,FilterPipe,OperatorService,GlobalService],
})
export class HomeComponent implements OnInit {

  categoryContent;//主题类别
  articalDetail=new Array();//文章的详细信息
  recommendAuthor;//推荐的作者
  page:number=0;//开始显示5篇文章，每点击一次在加载5个记录
  articalEnd:number=0;//判断文章是否全部加载完
  noMore:boolean=true;
  varWaitLoad:boolean=false;
  webUrl;

  constructor(
    private artical:GetArticalService,
    private filter:FilterPipe,
    private operator:OperatorService,
    private routes:Router,
    private global:GlobalService
  ) {}

  //加载更多文章
  funGetMoreArtical(page){
    this.varWaitLoad=true;//加载动画
    var data=JSON.stringify({name:'jianshu'});
    this.artical.search(data,'home/getArtical',page)
      .subscribe(
        (data)=>{
          console.log(data.status);
          switch(""+data.status)
          {
            case "0":
              for(var i=0,len=data.code.length;i<len;i++)
              {
                this.articalDetail.push(data.code[i]);
              }
              break;
            case "1":
              this.articalEnd=parseInt(data.status);
              this.noMore=false;
              //后续友好提示
          }
          this.varWaitLoad=false;
        }
      );
  }
  //点击或滚动时加载更多文章。
  funGetMore(){
    this.page+=6;
    this.funGetMoreArtical(this.page);
  }

  //推荐作者
  getRecommendAuthorResult(data,params){
    var that=this;
    this.artical.search(data,'home/getRecommendAuthor/'+params,0)
      .subscribe(
        (data)=>{
          switch(""+data.status)
          {
            case "0":
              that.recommendAuthor=data.code;
              break;
            case "1":
              console.log("数据为空");
          }
        }
      );
  }

  //添加关注:
  funAddFollow(author,ev){
    if(ev.target.innerHTML=='已关注')
    {
      return false;
    }
    if(sessionStorage.getItem("token"))
    {
      var token=sessionStorage.getItem("token");
      var data=JSON.stringify({author:author,token:token,flag:1});
      this.operator.sumitData(data,'home/addFollow').subscribe(
        (data)=>{
          console.log(JSON.stringify(data));
          switch(""+data.status)
          {
            case "0":
              ev.target.innerHTML='已关注';
              break;
            case "1":
          }
        }
      );
    }
    else
    {
      this.routes.navigate(['../login']);
    }

  }

  ngOnInit() {
    this.global.name='黄';
    this.webUrl=this.artical.webUrl;


    var that=this;

    //第一次加载文章
    this.funGetMoreArtical(this.page);
    var screenHeight=1100;

    //滚动加载文章
    $(window).scroll(function(){
      if($(window).scrollTop()>screenHeight)
      {
        if(that.articalEnd==1 || $(window).scrollTop()>3000) return false;
        that.funGetMore();
        screenHeight+=1200;
      }
    });

    //获取文章的主题
    var data=JSON.stringify({name:"无效参数"})
    this.artical.search(data,'home/category/theme',0)
      .subscribe(
        (data)=> {
          switch(""+data.status)
          {
            case "0":
              that.categoryContent=data.code;
              //console.log(that.categoryContent);
              break;
            case "1":
              console.log("数据为空");
          }
        }
      );

    //回到顶部
    this.operator.funGoToTop('#HomeToTop');

    //获取推荐的作者
    if(sessionStorage.getItem("token"))
    {
      var token=sessionStorage.getItem("token");
      var data=JSON.stringify({token:token,page:0});
      this.getRecommendAuthorResult(data,'login');
    }
    else
    {
      var data3=JSON.stringify({page:0});
      this.getRecommendAuthorResult(data3,'logOff');
    }
  }

}
