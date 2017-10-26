import {Component, ElementRef, Renderer, Output, EventEmitter ,OnInit} from '@angular/core'
import * as wangEditor from "../../../assets/javascript/wangEditor.js";
import {GetArticalService} from "../../services/getartical.service";
import {OperatorService} from "../../services/opeartor.service";
import {Router} from "@angular/router";

@Component({
  selector: 'write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css'],
  providers:[GetArticalService,OperatorService]
})
export class WriteComponent implements OnInit{

  selectMenu;
  callbackContent;
  resultHidden:boolean=false;
  private editor:any;
  //@Output() onPostData = new EventEmitter();

  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private getArtical:GetArticalService,
    private operator:OperatorService,
    private router:Router
  ) { }

  ngAfterViewInit() {
    let editordom = this.el.nativeElement.querySelector('#editorElem');
    this.editor = new wangEditor(editordom);
    this.editor.customConfig.uploadImgShowBase64 = true;
    this.editor.create()
  }

  //结果的显示与隐藏
  funResultHidden(){
    this.resultHidden=false;
  }
  //清空内容
/*  clearContent(){
    this.editor.txt.clear();
  }*/

  //获取内容;
  articalTitle='';//文章的标题
  clickHandle(title,category,sel):any {
    let data = this.editor.txt.html();//text表示获取文本

    console.log(sel);
    console.log(data);
    if(title.length>100 || !title || title.length==0)
    {
      this.callbackContent="标题格式错误";
      this.resultHidden=true;
      var that=this;
      setTimeout(function(){
        that.resultHidden=false;
      },3000);
      return false;
    }
    var reg=/^\d{1,2}$/;
    if(!reg.test(category))
    {
      return false;
    }

    if(data.length>30000 || data=="<p><br></p>")
    {
      this.callbackContent="内容格式错误";
      this.resultHidden=true;
      var that=this;
      setTimeout(function(){
        that.resultHidden=false;
      },3000);
      return false;
    }
    var reg = /<[^>]*>|<\/[^>]*>/gm;
    var con=data.replace(reg,"");
    var size=con.length;
    console.log(size);
    if(size<200)
    {
      this.callbackContent="再写点儿吧!不然一眼就看完啦！";
      this.resultHidden=true;
      var that=this;
      setTimeout(function(){
        that.resultHidden=false;
      },3000);
      return false;
    }
    if(sessionStorage.getItem("token"))
    {

      var token=sessionStorage.getItem("token");
      var sub=JSON.stringify({size:size,token:token,artical:data,title:title,category:category});
      var that=this;
      this.operator.sumitData(sub,'home/uploadartical')
        .subscribe(
          (data)=>{
            switch(""+data.status)
            {
              case "0":
                //保存成功之后清除页面内容
                that.callbackContent="保存成功";
                that.resultHidden=false;
                that.articalTitle='';
                that.editor.txt.clear();
                break;
              case "1":
                that.callbackContent="保存失败";
                break;
            }
            that.resultHidden=true;
            setTimeout(function(){
              that.resultHidden=false
            },3000);
          }
        );

    }
    else
    {
      this.callbackContent="请先登录";
      this.resultHidden=true;
      setTimeout(function(){
        this.resultHidden=false;
      },3000);
    }

  }

  ngOnInit(){
    this.resultHidden=false;
    var that=this;
    if(!sessionStorage.getItem('token'))
    {
      this.router.navigate(['../login']);
      return false;
    }
    var sub=JSON.stringify({token:sessionStorage.getItem('token')});

    this.operator.sumitData(sub,"home/category/entireTheme")
      .subscribe(
        (data)=>{
          console.log(data);
          switch(""+data.status)
          {
            case "0":
              that.selectMenu=data.code;
              break;

            case "1":
              console.log("没有获取到数据");
              break;
          }
        }
      );

  }

}
