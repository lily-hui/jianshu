import { Component, OnInit,OnDestroy} from '@angular/core';
import {OperatorService} from "../services/opeartor.service";
import {GetArticalService} from "../services/getartical.service";
import {FilterPipe} from "../filter.pipe";
import {Router} from "@angular/router";
import { FileUploader } from 'ng2-file-upload';

import {forEach} from "@angular/router/src/utils/collection";
declare var $:any;
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers:[OperatorService,GetArticalService,FilterPipe]
})
export class NewsComponent implements OnInit,OnDestroy {

  constructor(
    private operator:OperatorService,
    private getart:GetArticalService,
    private filter:FilterPipe,
    private router:Router
  ) { }




  //消失提示
  alertContet:string;
  varAlertToggle:boolean=false;

  //----------------------jQ动画效果-----------
    //显示效果
  menuListIndex:number=0;
    //根据鼠标选择加载内容：
  funMouseSle(){
    var that=this;
    $("#menuList>li").click(function(){

      $("#Cover").css({'display':'none'});
      $("#menuCover").css({"margin-top":'-600px'});

      var $index=$("#menuList > li").index(this);

      $("#temp>div").eq($index).css({'display':"block"});

      //根据选项加载数据
      // var $select=$("#temp>div").index($index);
      console.log("$select:"+$index);
      switch(""+$index)
      {
        case "0":
          that.fungetArtical(0);
          that.funGetCategory();
          break;
        case "1":
          that.funGetCategory();
          break;
        case "2":
          that.funGetReport(0);
      }
      var $nowTemp=$("#temp>div").eq($index);
      $("#temp>div").not($nowTemp).css({'display':"none"});
      that.menuListIndex=0;
    });
  }

    //27执行的操作
  funAnimate(){
    var that=this;
    //初始化数据
    that.menuListIndex=0;
    this.articalContainer=[];
    this.nowArtical=[];
    this.category=[];
    $("#menuList>li").css({'border':'1px solid #666'});

    $("#Cover").css({"display":'block'});

    $("#temp>div").css({'display':'none'});

    $("#menuCover")
      .animate({"margin-top":"80px"},1000)
      .animate({"margin-top":"20px"},500);
    //根据鼠标选项加载内容；
  }
      //9 table
  funSelMenuList(){
    var that=this;
    if($("#Cover").css("display")=='block')
    {
      var $index=$("#menuList>li").eq(that.menuListIndex);//当前元素
      $("#menuList>li").not($index).css({'border':'1px solid #666'});
      $index.css({"border":'1px solid #eee'});
      that.menuListIndex+=1;
      if(that.menuListIndex>$("#menuList>li").length-1)
      {
        that.menuListIndex=0;
      }
    }
  }
      //13 Enter
  funEnter(){
    this.nowArtical=[];
    this.articalContainer=[];
    var that=this;
    if($("#Cover").css("display")=='block')
    {
      $("#Cover").css({'display':'none'});
      $("#menuCover").css({"margin-top":'-600px'});

      // var $index=$("#menuList > li").index(this.menuListIndex);
      that.menuListIndex=that.menuListIndex-1;//上一步多加一
      $("#temp>div").eq(this.menuListIndex).css({'display':"block"});

      //根据选项加载数据
      switch(""+that.menuListIndex)
      {
        case "0":
          that.fungetArtical(0);
          that.funGetCategory();
          break;
        case "1":
          that.funGetCategory();
          break;
      }
      var $nowTemp=$("#temp>div").eq(this.menuListIndex);
      $("#temp>div").not($nowTemp).css({'display':"none"});
      that.menuListIndex=0;
    }
  }
      //根据不同的键执行不同的操作

  funKeydown(){
    var that=this;
    $(window).keydown(function(event){
      switch(""+event.keyCode)
      {
        case "27":
          that.funAnimate();
          break;
        case "9":
          that.funSelMenuList();
          return false;//阻止默认事件
        case "13":
          that.funEnter();
          return false;//阻止默认事件
      }
    });
  }
      //文章页菜单的显示与隐藏
  funArtCatAnimate(child,parent){
    var i=1;
    $(child).click(function(){
      if(i%2)
      {
          $(parent).animate({'right':"0"},1000);
          i+=1;
      }
      else
      {
        $(parent).animate({'right':'-250px'},1000);
        i+=1;
      }
    })
  }
      //文章页目录的显示与隐藏
  funCate(){
    $("#cate>span").eq(0).click(function(){
      this.style.borderBottom='2px solid #555';
      $("#cate>span").eq(1).css({'border':"0"});
      $("#cateBindOne").css({"display":'block'});
      $("#cateBindTwo").css({"display":'none'});
    });
    $("#cate>span").eq(1).click(function(){
      this.style.borderBottom='2px solid #555';
      $("#cate>span").eq(0).css({'border':"0"});
      $("#cateBindOne").css({"display":'none'});
      $("#cateBindTwo").css({"display":'block'});
    })
  }
     //选择是边框动画
  funHover(){
    $("#menuList>li").mouseenter(
      function(){
        this.style.border="1px solid #eeeeee";
      }
    );
    $("#menuList>li").mouseleave(
      function(){
        this.style.border="1px solid #555";
      }
    );
  }

  //-----------------文章页--------------
  funChangePage(param){
    switch(param)
    {
      case "next":
        if(this.articalContainer.length<10) break;
        this.artPage+=1;
        this.articalContainer=[];
        this.fungetArtical(this.artPage);
        break;
      case "prev":
        this.artPage-=1;
        if(this.artPage<0) break;
        this.articalContainer=[];
        this.fungetArtical(this.artPage);
    }
  }
  checkOk:string='简书通知:您的文章已通过检验！您可以在个人中心查看您写的文章。';
  alertInfo(){
    var that=this;
    this.varAlertToggle=true;
    setTimeout(function(){
      that.varAlertToggle=false;
    },3000);
  }
  funSave(){
    var token=sessionStorage.getItem('token');
    var data=this.nowArtical[0];
    data.token=token;
    data.selected=this.selected;
    var that=this;
    this.checkOk='简书通知:您的文章已通过检验！您可以在个人中心查看您写的文章。';
    data.checkResult=this.checkOk;
    data.checkFlag=1;//代表通过
    this.articalContainer.forEach(function(ele,index,self){
        if(that.nowArtical[0].blog_id==ele.blog_id)
        {
          self.splice(index,1);
        }
    });
    this.operator.sumitData(data,'manger/saveArtical')
      .subscribe(
        (data)=>{
          switch(""+data.status)
          {
            case "0":
              this.nowArtical=[];
              this.alertContet="修改成功";
              this.alertInfo();
              break;
            case "1":
              this.alertContet='修改失败';
              this.alertInfo();
              console.log("操作失败");
          }
        }
      );
  };
  funDelete(){
    var token=sessionStorage.getItem('token');
    var data=this.nowArtical[0];
    data.token=token;
    var that=this;
    this.checkOk='简书通知:您的文章未通过审核';
    data.checkResult=this.checkOk;
    data.checkFlag=2;//代表没通过
    this.articalContainer.forEach(function(ele,index,self){
      if(that.nowArtical[0].blog_id==ele.blog_id)
      {
        self.splice(index,1);
      }
    });
    this.operator.sumitData(data,'manger/saveArtical')
      .subscribe(
        (data)=>{
          switch(""+data.status)
          {
            case "0":
              this.nowArtical=[];
              this.alertContet="修改成功";
              this.alertInfo();
              break;
            case "1":
              this.alertContet="操作失败";
              this.alertInfo();
          }
        }
      );
  }
  //获取文章
  artical=new Array();//当前文章
  articalContainer=new Array();//装所有数据
  artticalNoMore:boolean=true;
  nowArtical=new Array();
  artPage:number=0;
  category:any;
  selected:string;//默认选中
  categoryIntroduce:string;

  fungetArtical(page){
    var token=sessionStorage.getItem('token');
    var data=JSON.stringify({token:token});
    this.getart.search(data,'manger/getArtical',page)
      .subscribe(
        (data)=> {
          switch ("" + data.status){
            case "0":
                for(var i=0,len=data.code.length;i<len;i++)
                {
                  this.articalContainer.push(data.code[i]);
                }
                this.funShowArtical(data.code[0].blog_id);
                // this.nowArtical=this.articalContainer[0];
                if(len<10) this.artticalNoMore=false;
              //console.log(JSON.stringify(this.articalContainer));
              break;
            case "1":
              this.artticalNoMore=false;//没有更多文章
          }
        }
      );
  }
  funShowArtical(blogId){
    var that=this;
    this.nowArtical=[];
    this.articalContainer.forEach(function(art,index,self){
      if(art.blog_id==blogId)
      {
        that.nowArtical.push(art);
        that.selected=art.category_id;
      }
    });
  }
  funGetCategory(){
    var token=sessionStorage.getItem("token");
    if(!token) return false;
    var data=JSON.stringify({token:token});
    this.operator.sumitData(data,"manger/getCategory")
      .subscribe(
        (data)=>{
          switch(""+data.status)
          {
            case "0":
              this.category=data.code;
              break;
            case "1":
              this.category=[];
          }
        }
      )
  }
  funSelChange(){
    var that=this;
    console.log("-----------------");
      this.category.forEach(function(ele,index,self){
        if(""+that.selected==""+ele.category_id)
        {
            that.categoryIntroduce=ele.introduce;
            console.log(that.categoryIntroduce);
        }
      })
  }

  //显示提示信息
  funshowAlert(){
    this.varAlertToggle=true;
    var that=this;
    setTimeout(function(){
      that.varAlertToggle=false;
    },3000)
  }

  //-------------------------------目录页

  nowCategory=new Array();
  funcateInfoShow(catrgoryId){
    var that=this;
    this.nowCategory=[];
    this.category.forEach(function(ele,index,self){
      if(""+ele.category_id==""+catrgoryId)
      {
        that.nowCategory.push(ele);
        console.log(that.nowCategory);
      }
    });

  }


  funSubCate(param,obj){
    var cateIntro=obj.categoryIntroduce;
    var cateName=obj.categoryName;
    var token=sessionStorage.getItem("token");
    if(!sessionStorage.getItem("token"))
    {
      this.router.navigate(['/login']);
      return false;
    }
    if(cateIntro=='' || cateName=='')
    {
      this.alertContet='内容为空';
      return false;
    }
    //匹配特殊字符

      obj.token=token;
    if(param=='new')
    {
        this.operator.sumitData(obj,'manger/cateOpera/new')
          .subscribe(
            (data)=>{
              switch(""+data.status)
              {
                case "0":
                  this.alertContet='新建成功';
                  break;
                case "1":
                  this.alertContet='新建失败';
                  break;
              }
              this.funshowAlert();
            }
          )
    }
    if(param=='edit')
    {
      obj.categoryId=this.nowCategory[0].category_id;
      this.operator.sumitData(obj,'manger/cateOpera/edit')
        .subscribe(
          (data)=>{
            switch(""+data.status)
            {
              case "0":
                this.alertContet='修改成功';
                break;
              case "1":
                this.alertContet='修改失败';
                break;
            }
            this.funshowAlert();
          }
        )
    }
  }

  //上传目录头像
  uploader:FileUploader = new FileUploader({
    url: "http://localhost:3000/admin/perfect/upfile",
    method: "POST",
    itemAlias: "photo",
    headers:[{name:"author",value:"k,o"}]

  });

  funShowInfo(){
    this.varAlertToggle=true;
    var that=this;
    setTimeout(function(){
      that.varAlertToggle=false;
    },3000);
  }
  selectedFileOnChanged(file){
    //还需要对图片进行过滤
    if(!sessionStorage.getItem("token")) {this.router.navigate(['/login']);return false;}
    var that=this;
    console.log(file);
    if(file=='')
    {
      this.alertContet='请选择文件';
      that.funShowInfo();
      return false;
    }
    this.uploader.queue[0].upload();
    this.uploader.queue[0].onSuccess=function(res,state,header){
      if(state==200)
      {
        // console.log("上传成功");
      }
      else {console.log("上传失败");}
      var data=JSON.parse(res);
      switch(""+data.status)
      {
        case "0":
          that.alertContet="上传成功";
          break;
        case "1":
          that.alertContet="上传文件失败";
          break;
      }
      that.funShowInfo();
    };

  }

  //-----------------举报页
  nowReport=new Array();
  report;
  reportPage:number=0;
  //根据举报id显示举报内容

  //根据页码加载举报
  funGetReport(param){
    if(!sessionStorage.getItem("token"))
    {
      this.router.navigate(['/login']);
      return false;
    }
    var token=sessionStorage.getItem("token");
    var data=JSON.stringify({token:token});
    this.getart.search(data,'manger/report',param)
      .subscribe(
        (data)=>{
          console.log(JSON.stringify(data.code));
          switch(""+data.status)
          {
            case "0":
              this.report=data.code;
              this.nowReport.push(data.code[0]);
              this.funReportInfoShow(this.nowReport[0].id);
              break;
          }
        }
      );
  }

  funReportInfoShow(id){
    var that=this;
    this.report.forEach(function(ele,index,self){
      if(""+ele.id==""+id)
      {
        that.nowReport.push(ele);
      }
    })
  }

  ngOnInit() {
    if(sessionStorage.getItem("token"))
    {
      //注册事件
      this.funAnimate();
      this.funKeydown();
      this.funSelMenuList();
      this.funArtCatAnimate('#leftMenu','#leftContainer');
      this.funArtCatAnimate('#categoryMenu','#categoryMenuContainer');
      this.funArtCatAnimate('#reportMenu','#reportMenuContainer');
      this.funCate();
      this.funHover();
      this.funMouseSle();
      // this.fungetArtical(0);
    }

  }

  ngOnDestroy(){
    $("#Cover").css({'display':'none'});
  }
}
