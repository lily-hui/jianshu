import {Component,OnInit,AfterContentChecked} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GetArticalService} from "../../services/getartical.service";
import {FilterPipe} from "../../filter.pipe";
import {Router} from "@angular/router";
import {OperatorService}  from "../../services/opeartor.service";
declare var $:any;
@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css'],
  providers: [GetArticalService,FilterPipe,OperatorService]
})
export class PersonalCenterComponent implements OnInit,AfterContentChecked {
  constructor(
    private route:ActivatedRoute,
    private art:GetArticalService,
    private fileter:FilterPipe,
    private router:Router,
    private operator:OperatorService,
  ) { }

  webUrl;
  userId;//用户id
  blog=new Array();//装结果
  like=new Array();//装结果
  concern=new Array();//装关注
  collection;//装收藏

  userInfo;//用户信息
  selfUserId:number;
  varWaitLoad:boolean=false;
  noMoreBlog:boolean=true;
  noMoreConcern:boolean=true;
  noMoreLike:boolean=true;

  toggleClassSelf={};//关注与已关注的样式
  toggleContentSelf='关注';

  //加载更多Blog,like
  likePage:number=-8;
  blogPage:number=-8;
  concernPage:number=-8;
  //获取自己写的文章
  funGetBlog(){
    if(!this.noMoreBlog || this.blog.length%8!=0) return false;
    this.blogPage+=8;
    this.varWaitLoad=true;
    var that=this;
    var data=JSON.stringify({userId:this.userId});
    this.art.search(data,'personal/getPersonalCenterInfo/blog',this.blogPage)
      .subscribe(
        (data)=>{
          switch(""+data.status)
          {
            case "0":
              for(var i=0,len=data.code.length;i<len;i++)
              {
                that.blog.push(data.code[i]);
              }
              len<8 ? this.noMoreBlog=false : this.noMoreBlog=true;
              break;
            case "1":
              that.noMoreBlog=false;
              break;
          }
          this.varWaitLoad=false;
        }
      );

  }

  //获取自己喜欢的文章
  funGetLike(){
    if(!this.noMoreLike || this.like.length%8!=0) return false;
    this.likePage+=8;
    this.varWaitLoad=true;
    var data=JSON.stringify({userId:this.userId});
    this.art.search(data,'personal/getPersonalCenterInfo/like',this.likePage)
      .subscribe(
        (data)=>{

          // console.log("喜欢的文章:"+JSON.stringify(data));
          switch(""+data.status)
          {
            case "0":
              for(var i=0,len=data.code.length;i<len;i++)
              {
                this.like.push(data.code[i]);
              }
              len<8 ? this.noMoreLike=false:this.noMoreLike=true;
              break;
            case "1":
              this.noMoreLike=false;
              break;
          }
          this.varWaitLoad=false;
        }
      )
  }

  //获取自己关注的作者
  funGetConcern(){
    if(!this.noMoreConcern || this.concern.length%8!=0) return false;
    this.varWaitLoad=true;
    this.concernPage+=8;

    var data=JSON.stringify({userId:this.userId});
    this.art.search(data,'personal/getPersonalCenterInfo/concern',this.concernPage)
      .subscribe(
        (data)=>{
          console.log(data.code.length);

          switch(""+data.status)
          {
            case "0":
              for(var i=0,len=data.code.length;i<len;i++)
              {
                this.concern.push(data.code[i]);
              }
              len<8 ? this.noMoreConcern=false:this.noMoreConcern=true;
              break;
            case "1":
              this.noMoreConcern=false;
              break;
          }
          this.varWaitLoad=false;
        }
      );

  }

  //获取作者的信息
  funGetUserInfo(){
    var data=JSON.stringify({userId:this.userId});
    this.operator.sumitData(data,'personal/getPersonalCenterInfo/info')
      .subscribe(
        (data)=>{
          //console.log("blog请求"+JSON.stringify(data));
          switch(""+data.status)
          {
            case "0":
              this.userInfo=data.code;
              break;
            case "1":
              console.log("没有查到数据");
          }
        }
      );
  }

  //获取写的文章和喜欢的文章,根据选项卡的值加载数据
  funGetMore(cate){
    switch(cate)
    {
      case "blog":
        this.funGetBlog();
        break;
      case "like":
        this.funGetLike();
        break;
      case 'concern':
        this.funGetConcern();
    }
  }

  funReload(param){
    this.likePage=-8;
    this.blogPage=-8;
    this.concernPage=-8;
    this.userId=parseInt(param);
    this.noMoreBlog=true;
    this.noMoreConcern=true;
    this.noMoreLike=true;
    this.blog=[];
    this.like=[];
    this.concern=[];
    this.funGetUserInfo();
    this.funGetBlog();
    this.funGetLike();
    this.funGetConcern();
  }

  ngOnInit() {
    this.webUrl=this.operator.webUrl;
    this.userId=parseInt(this.route.snapshot.paramMap.get('userId'));
    this.selfUserId=parseInt(sessionStorage.getItem("userId"));

    //自身所见与别人所见的关注样式
    if(parseInt(sessionStorage.getItem('userId'))==this.userId)
    {
      this.toggleClassSelf={'concernBtn':true,'toggleConcern':false},
      this.toggleContentSelf='已关注';
    }
    else
    {
      this.toggleClassSelf={'concernBtn':true,'toggleConcern':true},
      this.toggleContentSelf='关注';
    }

    //获取自己写的文章
    this.funGetBlog();

    //获取用户的一些信息
    this.funGetUserInfo();

    //回到顶部
    this.operator.funGoToTop("#personalToTop");

  }

  ngAfterContentChecked(){
    console.log("当前用户id："+this.userId);

  }

  //选项卡
  articalStyle={display:'block'};
  concrenStyle={display:'none'};
  collectionStyle={display:'none'};
  likeStyle={display:'none'};
  funShowMenu(flag,ev){
    for(var i=0;i<3;i++)
    {
      ev.target.parentNode.children[i].style.borderBottom="2px solid transparent";
    }
    ev.target.style.borderBottom='2px solid #555';
    //console.log(ev);
    switch(flag)
    {
      case "artical":
        this.articalStyle={display:'block'};
        this.concrenStyle={display:'none'};
        this.collectionStyle={display:'none'};
        this.likeStyle={display:'none'};

        //获取自己写的文章
        this.funGetBlog();

        break;
      case "concren":
        this.articalStyle={display:'none'};
        this.concrenStyle={display:'block'};
        this.collectionStyle={display:'none'};
        this.likeStyle={display:'none'};
        //获取关注的作者
        this.funGetConcern();
        break;
      case "collection":
        this.articalStyle={display:'none'};
        this.concrenStyle={display:'none'};
        this.collectionStyle={display:'block'};
        this.likeStyle={display:'none'};
        break;
      case "like":
        this.articalStyle={display:'none'};
        this.concrenStyle={display:'none'};
        this.collectionStyle={display:'none'};
        this.likeStyle={display:'block'};

        //获取个人中心喜欢的文章
        this.funGetLike();

        break;

    }
  }

  //关注作者的切换 变量的共用造成其中的一个数据改变时，所表现的行为一致。
  funAddFollow(id,ev){
    //任何人的关注与取消关注
    if(sessionStorage.getItem("userId"))
    {
      var follow=sessionStorage.getItem("userId");
      if(follow==this.userId)
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
        console.log("作者的id:"+id);
        if(val=='关注'){flag=1;}
        else{flag=2;}
        console.log("用户的id:"+follow);
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

}
