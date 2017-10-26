import { Component, OnInit } from '@angular/core';
import {OperatorService} from "../services/opeartor.service";
import {Router} from "@angular/router";
import { FileUploader } from 'ng2-file-upload';

declare var $;
@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.css']
})
export class SetComponent implements OnInit {

  constructor(
    private operator:OperatorService,
    private router:Router
  ) { }
  //菜单动画
  funMenuAnimate(){
    $("#leftNavMenu>li").click(function(){
      $("#leftNavMenu>li").not(this).css({'background-color':"#ffffff"});
      $(this).css({'background-color':'#f0f0f0'});
      var $index=$("#leftNavMenu>li").index(this);//获取当前点击的是第几个按钮
      $("#personalContent>div").not(this).css({'display':'none'});
      $("#personalContent>div").eq($index).css({"display":'block'});
    });


  }


  funLeftMenu(){
    $(document).mouseover(function(event){
      console.log(event.pageX+"+"+event.pageY);
      console.log(event.pageY > 60 && event.pageX<200);
      if((event.pageY > 60) && (event.pageX<200))
      {
        // $("#personalLeftMenu").animate({'left':'200px'});
        $("#personalLeftMenu")[0].style.left='0';
        console.log($("#personalLeftMenu").offset().left);
        console.log($("#personalLeftMenu").offset().top);
      }
      else
      {
        $("#personalLeftMenu").animate({'left':'-200px'},500);
      }
    });
  }


  //上传头像
  uploader:FileUploader = new FileUploader({
    url: "http://localhost:3000/admin/perfect/upfile",
    method: "POST",
    itemAlias: "photo",
    headers:[{name:"author",value:sessionStorage.getItem('token')}]
  });

  selectedFileOnChanged(file){
    //还需要对图片进行过滤
    if(!sessionStorage.getItem("token")) {this.router.navigate(['/login']);return false;}
    var that=this;
    console.log(file);
    if(file=='')
    {
      this.showResult='请选择文件';
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
          that.showResult="上传成功";
          sessionStorage.removeItem("head");
          sessionStorage.setItem("head",data.head);
          break;
        case "1":
          that.showResult="上传文件失败";
          break;
      }
      that.funShowInfo();
    };

  }



  sexRadio:number=3;
  introduce:string;
  webUrl:any;
  nickname:any;
  email:string;
  showResult:string;//结果显示
  resultHidden:boolean=false;//显示结果的隐藏
  file;//上传文件
  //--------------信息完善------------------
   //控制提示的显示与隐藏
  funShowInfo(){
    this.resultHidden=true;
    var that=this;
    setTimeout(function(){
      that.resultHidden=false;
    },3000);
  }
  funSubmitInfo() {
    console.log(this.nickname);
    var that = this;
    try{
      if (this.sexRadio != 1 && this.sexRadio != 2 && this.sexRadio != 3) {
        this.showResult = "请填写性别";
        this.funShowInfo();
        return false;
      }

      if(this.introduce==undefined)
      {
        this.showResult = "写点吧！";
        this.funShowInfo();
        return false;
      }
      this.introduce = this.introduce.replace(/[\r\n]+/g, "");
      if (this.introduce.length > 300) {
        this.showResult = "内容不能超过300字哦！";
        this.funShowInfo();
        return false;
      }
      this.introduce+=' ';

      var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
      if (!reg.test(this.webUrl)) {
        this.showResult = "地址输入错误";
        this.funShowInfo();
        return false;
      }

      var reg=/^((?=[\x21-\x7e]+)[^A-Za-z0-9])/;
      if(!reg.test(this.nickname)) {
        this.showResult = "昵称由英文，字母，数字组成";
        this.funShowInfo();
        return false;
      }
      if(this.nickname==undefined)
      {
        this.showResult = "取个名字吧！";
        this.funShowInfo();
        return false;
      }
      this.nickname+=" ";
      var reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/g;
      if(!reg.test(this.email)) {
        this.showResult = "邮箱格式错误";
        this.funShowInfo();
      }
      if (sessionStorage.getItem("token"))
      {
        var token = sessionStorage.getItem("token");
        var sub = {
          token: token,
          sex: this.sexRadio,
          introduce: this.introduce,
          webUrl: this.webUrl,
          email: this.email,
          nickname:this.nickname
        }
      }
      else
      {
        this.router.navigate(['/login']);
      }
    } catch(err)
    {
      console.log(err);
      return false;
    }
    console.log(sub.nickname);
    this.operator.sumitData(sub, "admin/perfect/info")
      .subscribe(
        (data) => {
          console.log(data);
          switch ("" + data.status) {
            case "0":
              that.showResult = "保存成功";
              break;
            default:
              that.showResult = "保存失败!";
          }
          this.funShowInfo();
        }
      );


  }

  //获取用户的信息
  fungetUserInfo(){
    if(!sessionStorage.getItem("token"))
    {
      this.router.navigate(['/login']);
      return false;
    }
    var token=sessionStorage.getItem('token');
    var data=JSON.stringify({token:token});
    this.operator.sumitData(data,'admin/getUserInfo')
      .subscribe(
        (data)=>{
          switch(""+data.status)
          {
            case "0":
              this.nickname=data.code[0].nickname;
              this.webUrl=data.code[0].weburl;
              this.email=data.code[0].email;
              this.introduce=data.code[0].introduce;
              break;
          }
        }
      )
  }


  ngOnInit() {
    this.funMenuAnimate();
    //this.funLeftMenu();
    this.fungetUserInfo();
  }

}
