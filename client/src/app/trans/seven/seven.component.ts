import { Component, OnInit } from '@angular/core';
import {GetArticalService} from "../../services/getartical.service";
import {FilterPipe} from "../../filter.pipe";
import {OperatorService} from "../../services/opeartor.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-seven',
  templateUrl: './seven.component.html',
  styleUrls: ['./seven.component.css'],
  providers:[GetArticalService,FilterPipe,OperatorService]

})
export class SevenComponent implements OnInit {

  webUrl;
  recommendAuthor;//推荐作者

  allArtical=new Array();//获取30天的所有文章

  page:number=-6;//默认显示6页

  alertShow:boolean=false;
  alertContent;
  noMore:boolean=true;
  varWaitLoad:boolean=false;

  constructor(
    private artical:GetArticalService,
    private filter:FilterPipe,
    private operator:OperatorService,
    private routes:Router
  ) { }
  //关闭提示
  closeAlert(){
    this.alertShow=false;
  }

  //获取更多文章
  getMoreArtical(){
    this.page=this.page+6;
    this.varWaitLoad=true;
    var seven=JSON.stringify({day:7});
    this.artical.search(seven,'home/getTimerArtical',this.page)
      .subscribe(
        (data)=>{
          console.log(data);
          switch(""+data.status)
          {
            case "0":
              for(let i=0,len=data.code.length;i<len;i++)
              {
                this.allArtical.push(data.code[i]);
              }
              if(data.code.length<7) this.noMore=false;
              break;
            case "1":
              this.noMore=false;
              console.log("没哟欧获取到数据");
          }
          this.varWaitLoad=false;
        }
      );

  }

  //添加关注
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

  //获取推荐的作者
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

  ngOnInit() {
    this.webUrl=this.operator.webUrl;
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

    //获取前7天的文章
    this.getMoreArtical();

    this.operator.funGoToTop("#sevenToTop");
  }

}
