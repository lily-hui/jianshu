import { Component, OnInit,AfterContentChecked } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {GetArticalService} from "../services/getartical.service";
import {OperatorService} from "../services/opeartor.service";
import {FilterPipe} from "../filter.pipe";
import {Router} from "@angular/router";
import {LoginService} from "../services/login.service";
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers:[OperatorService,FilterPipe,LoginService,GetArticalService]
})
export class SearchComponent implements OnInit,AfterContentChecked {

  webUrl;
  articleSearch:boolean=true;
  userSearch:boolean=false;
  thematicSearch:boolean=false;
  articlesSearch:boolean=false;
  personalHead:any;
  hiddenNavs:boolean=false;
  navbarHidden:boolean=true;
  searchContent;//搜索的内容
  showSelect:boolean=false;
  flag:boolean=false;//管理员的显示

  constructor(
    private route:ActivatedRoute,
    private login:LoginService,
    private filter:FilterPipe,
    private operator:OperatorService,
    private router:Router,
    private getart:GetArticalService
  ) { }

  funLinkToPersonal(){
    if(sessionStorage.getItem("userId"))
    {
      var userId=sessionStorage.getItem("userId");
      this.router.navigate(['./PersonalCenter',userId]);
    }
    else
    {
      this.router.navigate(['/PersonalCenter',]);
    }
  }
  //个人信息下拉框的显示与隐藏
  funcShowSelect(){
    this.showSelect=true;
  }
  funcHiden(){
    this.showSelect=false;
  }

  SearchShow(flag:string,ev){
    switch(flag)
    {
      case "article":
        this.articleSearch=true;
        this.userSearch=false;
        this.thematicSearch=false;
        this.articlesSearch=false;
        break;
      case "user":
        this.articleSearch=false;
        this.userSearch=true;
        this.thematicSearch=false;
        this.articlesSearch=false;
        break;
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
          this.router.navigate(['']);
        }
      );
    }
    else
    {
      console.log("session为空");
    }
  }



  //关注
  /*
  concernToggle:boolean=true;//关注的切换
  funAddFollow(id,ev){
    //任何人的关注与取消关注
    if(sessionStorage.getItem("userId"))
    {
      var follow=sessionStorage.getItem("userId");
      if(""+follow==""+id)
      {
        var val=ev.target.value;
        if(val=='已关注')
        {
          ev.target.value='关注';
          ev.target.style.backgroundColor='#3db922';
          ev.target.style.color='#ffffff';
        }
        else
        {
          ev.target.value='已关注';
          ev.target.style.backgroundColor='#f8f8f8';
          ev.target.style.color='#555';
        }
        var flag;//1代表关注,2代表取消关注
        if(val=='关注'){flag=1;}
        else{flag=2;}
        var token=sessionStorage.getItem("token");
        var data=JSON.stringify({author:id,token:token,flag:flag});
        this.operator.sumitData(data,'home/addFollow')
          .subscribe(
            (data)=>{
              switch(""+data.status)
              {
                case "0":
                  break;
                case "1":
                  break;
              }
            }
          );

      }
      else
      {
        //若不是本人，显示关注
        var val=ev.target.value;
        if(val=='已关注')
        {
          ev.target.value='关注';
          ev.target.style.backgroundColor='#3db922';
          ev.target.style.color='#ffffff';
        }
        else
        {
          ev.target.value='已关注';
          ev.target.style.backgroundColor='#f8f8f8';
          ev.target.style.color='#555';
        }
        var flag;//1代表关注,2代表取消关注
        if(val=='关注'){flag=1;}
        else{flag=2;}
        var token=sessionStorage.getItem("token");
        var data=JSON.stringify({author:id,token:token,flag:flag});
        this.operator.addFollow(data)
          .subscribe(
            (data)=>{
              switch(""+data.status)
              {
                case "0":
                  break;
                case "1":
                  break;
              }
            }
          );
      }
    }
    else
    {
      this.router.navigate(['../login']);
    }

  }
  */

  userPage:number=-1;
  articalPage:number=-1;
  categoryPage:number=-1;

  userSum=new Array();
  articalSum=new Array();
  categorySum=new Array();

  varWaitLoad:boolean=false;
  userNomore=true;
  articalNomore=true;


  funGetUser(){
    this.varWaitLoad=true;
    this.userPage+=1;
    if(this.userSum.length%8!=0) return false;
    var data=JSON.stringify({searchContent:this.searchContent});
    this.getart.search(data,'artical/search/user',this.userPage)
      .subscribe(
        (data)=>{
          switch(""+data.status)
          {
            case "0":
              let len=data.code.length;
              for(let i=0;i<len;i++)
              {
                this.userSum.push(data.code[i]);
              }
              len<8 ? this.userNomore=false:this.userNomore=true;
              break;
            case "1":
              this.userNomore=false;
          }
          this.varWaitLoad=false;

        }
      );
  }

  funGetArtical(){
    if(this.articalSum.length%8!=0) return false;
    this.varWaitLoad=true;
    this.articalPage+=1;
    var data=JSON.stringify({searchContent:this.searchContent});
    this.getart.search(data,'artical/search/art',this.articalPage)
      .subscribe(
        (data)=>{
          switch(""+data.status)
          {
            case "0":
              let len=data.code.length;
              for(let i=0;i<len;i++)
              {
                this.articalSum.push(data.code[i]);
              }
              len<8 ?this.articalNomore=false:this.articalNomore=true;
              this.varWaitLoad=false;
              break;
            case "1":
              this.articalNomore=false;
          }
          this.varWaitLoad=false;
        }
      );
  }

  //搜索
  funSearch(){
    //根据关键字查询用户和相关文章与专题
    console.log("搜搜的内容:"+this.searchContent);
    this.articalSum=[];
    this.userSum=[];
    this.articalPage=-1;
    this.userPage=-1;
    this.funGetArtical();
    this.funGetUser();
  }

  ngOnInit() {

    this.webUrl=this.operator.webUrl;

    this.hiddenNavs = Boolean(sessionStorage.getItem("token"));
    this.navbarHidden=true;
    var admin=sessionStorage.getItem("flag");
    (admin=='admin') ? this.flag=true :  this.flag=false;

    this.searchContent=this.route.snapshot.paramMap.get('query');
    this.funSearch();

    this.operator.funGoToTop("#searchToTop");
  }

  ngAfterContentChecked(){
    this.personalHead=sessionStorage.getItem("head");
    this.hiddenNavs = Boolean(sessionStorage.getItem("token"));
  }
}
