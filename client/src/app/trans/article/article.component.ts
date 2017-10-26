import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GetArticalService} from "../..//services/getartical.service";
import {FilterPipe} from "../../filter.pipe";
import {OperatorService} from "../../services/opeartor.service";
declare var $:any;
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  providers:[OperatorService,GetArticalService,FilterPipe]
})
export class ArticleComponent implements OnInit {

  webUrl;
  articalId:number;//文章的id
  articalContent;//文章的信息
  authorInfo;//作者的详细信息
  articalComment=new Array();//文章的评论信息
  userHead;//浏览文章的用户头像
  noMore:boolean=true;
  varWaitLoad:boolean=false;



  likeComment:boolean=true;
  ascComment:boolean=false;
  descComment:boolean=false;
  /*
  commentShow(t:string){
    switch (t)
    {
      case "like":
        this.likeComment=true;
        this.ascComment=false;
        this.descComment=false;
        break;
      case "asc":
        this.likeComment=false;
        this.ascComment=true;
        this.descComment=false;
        break;
      case "desc":
        this.likeComment=false;
        this.ascComment=false;
        this.descComment=true;
        break;
    }
  }
  */

  //点击评论、添加新评论、回复弹出
  writeContentHidden;//评论的显示与隐藏
  addShow(){
    this.writeContentHidden={display:'block'};
  }
  //点击取消隐藏
  funContentHidden()
  {
    this.writeContentHidden={display:'none'};
  }


  //举报弹框
  //点击x 或取消关闭
  radioValue:number=3;
  reportValue:string;
  reportShow:boolean=false;
  reportInfo:string;//控制提示的内容
  reportInfoToggle:boolean=false;//控制提示的显示
  //发送举报
  funCoverShowSend(){
    var that=this;
      if(this.reportValue.length>200)
      {
        this.reportInfoToggle=true;
        this.reportInfo='您输入的内容太长啦！';
        setTimeout(function () {
          that.reportInfoToggle=false;
          this.reportInfo='';
        },3000);
        return false;
      }
      var token=sessionStorage.getItem("token");
      var data=JSON.stringify({content:this.reportValue,blogId:this.articalId,token:token,type:this.radioValue});
      this.operator.sumitData(data,"home/report")
        .subscribe(
          (data)=>{
            switch(""+data.status)
            {
              case "0":
                that.varAlertHidden=true;
                that.varAlertContent='举报成功';
                that.reportInfo='';
                setTimeout(function () {
                    that.varAlertHidden=false;
                  },3000);
                break;
              case "1":
                break;
            }
          }
        );
    that.reportShow=false;
  }
  //取消举报
  funCoverCancel(){
    this.reportShow=false;
  }
  //举报框的显示与隐藏
  funShowReport(){
    if(!sessionStorage.getItem('token'))
    {
      this.router.navigate(['../login']);
      return false;
    }
    this.reportShow=true;
  }


  //点击评论
  varAlertHidden:boolean=false;
  varAlertContent='';
  commentContent;//评论的内容
  commentPage:number=-10;

  //评论
  funSaveComment(comment){
    var that=this;
    if(sessionStorage.getItem("token"))
    {
      var token=sessionStorage.getItem("token");
      var reg = /<[^>]*>|<\/[^>]*>/gm;
      var content=comment.replace(reg,"");
      if(content.length>300)
      {
        this.varAlertHidden=true;
        this.varAlertContent="评论内容在300个字符以内";
        setTimeout(function(){
          that.varAlertHidden=false;
        },4000);
        return false;
      }

      var data=JSON.stringify({content:content,token:token,articalId:this.articalId});
      this.operator.sumitData(data,'home/sendComment').subscribe(
        (data)=>{
          switch(""+data.status)
          {
            case "0":
              that.varAlertHidden=true;
              that.varAlertContent="评论成功";
              that.commentContent='';
              setTimeout(function(){
                that.varAlertHidden=false;
              },3000);
              that.articalComment=[];
              for(let i=0,len=data.code.length;i<len;i++)
              {
                that.articalComment.push(data.code[i]);
              }
              that.noMore=true;
              that.commentPage=0;
              break;
            case "1":
              that.articalComment=[];
              break;
          }

        }
      );

    }
    else
    {
      this.router.navigate(['../login']);
    }
  }

  funSendComment(comment){
    this.funSaveComment(comment);
  }
  funKeydown(val,ev){
    if(ev.keyCode==13)
    {
      this.funSaveComment(val);
    }
  }

  //关注
  concernToggle:boolean=true;//关注的切换
  funAddFollow(id){
    if(!sessionStorage.getItem("token"))
    {
      this.router.navigate(['../login']);
      return false;
    }
    var flag;//1代表关注,2代表取消关注
    if(this.concernToggle){flag=1;}
    else{flag=2;}
    var token=sessionStorage.getItem("token");
    var data=JSON.stringify({author:id,token:token,flag:flag});
    this.operator.sumitData(data,'home/addFollow')
      .subscribe(
        (data)=>{
          switch(""+data.status)
          {
            case "0":
              this.concernToggle=false;
              break;
            case "1":
              this.concernToggle=true;
              break;
          }
        }
      );
  }

  //喜欢
  varLikeToggle:boolean=true;
  funAddLike(){
    if(!sessionStorage.getItem("token"))
    {
      this.router.navigate(['../login']);
      return false;
    }
    var flag;//1代表添加喜欢，2代表取消喜欢
    if(this.varLikeToggle) {flag=1;}
    else{flag=2;}
    var token=sessionStorage.getItem("token");
    var data=JSON.stringify({token:token,articalId:this.articalId,flag:flag});
    this.operator.sumitData(data,'artical/addLike')
      .subscribe(
        (data)=>{
          //console.log(JSON.stringify(data));
          switch(""+data.status)
          {
            case "0":
              this.varLikeToggle=false;
              break;
            case "1":
              this.varLikeToggle=true;
              break;
          }
        }
      );
  }

  //获取更多评论
  funGetMore(){
    this.getComment();
  }

  constructor(
    private route:ActivatedRoute,
    private art:GetArticalService,
    private filter:FilterPipe,
    private router:Router,
    private operator:OperatorService
  ) { }

  //获取该文章作者的信息
  getAuthorInfo(){
    var data=JSON.stringify({blogId:this.articalId});
    this.operator.sumitData(data,'home/getSingleAuthorInfo').subscribe(
      (data)=>{
        switch(""+data.status)
        {
          case "0":
            this.authorInfo=data.code;
            break;
          case "1":
            console.log("没有获取到数据");
        }
      }
    );
  }

 //获取文章的相关评论
  getComment(){
    this.commentPage+=10;
    this.varWaitLoad=true;
    var data2=JSON.stringify({articalId:this.articalId,});
    this.art.search(data2,'home/getArticalComment',this.commentPage).subscribe(
      (data)=>{
        console.log(JSON.stringify(data.status));
        switch(""+data.status)
        {
          case "0":
            for(var i=0,len=data.code.length;i<len;i++)
            {
              this.articalComment.push(data.code[i]);
            }
            len<10 ? this.noMore=false:this.noMore=true;
            break;
          case "1":
            this.noMore=false;
        }
        this.varWaitLoad=false;
      }
    );
  }

  ngOnInit() {
    this.webUrl=this.operator.webUrl;


    this.articalId=parseInt(this.route.snapshot.paramMap.get('id'));
    this.writeContentHidden={display:'none'};//文本域的隐藏

    this.operator.funGoToTop("#articaltop");
    //获取文内容即其信息
    var data=JSON.stringify({id:this.articalId});
    this.operator.sumitData(data,'home/getSingleArtical')
      .subscribe(
        (data)=> {
          switch(""+data.status)
          {
            case "0":
              this.articalContent=data.code;
              break;
            case "1":
              console.log("数据为空");
          }
        }
      );

    //获取该文章作者的详细信息
    this.getAuthorInfo();

    //获取文章的评论
    this.getComment();


    $("#report").click(function(){
        console.log("aaaa");
    });

    //回到顶部
    this.operator.funGoToTop("#articalToTop");


    // 举报弹框
/*    $("#report").click(function(){
      alert("a");
    });
    $("#report-modal").click(function(){
      console.log("a");
      $("#report").css({'display':'block','z-index':'100'});
    });*/



    //textarea那里当登录了之后显示用户自己的头像，当没有登录的时候，显示默认的头像
    if(sessionStorage.getItem("head"))
    {
      var head=sessionStorage.getItem("head");
      this.userHead=head;
      //判断该用户是否已经关注或喜欢过该文章
      var token=sessionStorage.getItem("token");
      var data=JSON.stringify({token:token,blogId:this.articalId});
      this.operator.sumitData(data,"artical/searchArticalLikeConcern")
        .subscribe(
          (data)=>{
            data.likeStatus==0 ? this.varLikeToggle=false :this.varLikeToggle=true;
            data.followStatus==0 ?this.concernToggle=false :this.concernToggle=true;
          }
        );
    }
    else
    {this.userHead="888888.jpg";}
  }


}
