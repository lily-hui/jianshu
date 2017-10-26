import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GetArticalService} from "../../services/getartical.service";
import {FilterPipe} from "../../filter.pipe";
import {OperatorService} from "../../services/opeartor.service";
declare var $:any;
@Component({
  selector: 'app-categary',
  templateUrl: './categary.component.html',
  styleUrls: ['./categary.component.css'],
  providers:[GetArticalService,FilterPipe,OperatorService],
})
export class CategaryComponent implements OnInit {

  webUrl;
  categoryId:number;//该目专题目录的id
  categoryArtical=new Array();//获取该专题下的文章
  categoryInfo;//文章的信息
  noMore:boolean=true;
  articalAdd:number=-8;//默认显示8条，然后没每点击一次加8条
  varWaitLoad:boolean=false;




  //展开，收起
  open_close;
  close;
  openShow(){
    this.open_close={display:'block'};
    this.close={display:'none'};
  }
  closeShow(){
    this.close={display:'block'};
    this.open_close={display:'none'};
  }

  //弹框，点击弹出
  deleteHidden;
  deleteHidden2;
  listShow1(){
    this.deleteHidden={display:'block'};
  }

  listShow2(){
    this.deleteHidden2={display:'block'};
  }

  //弹框,点击关闭
  cover1Show(){
    // this.deleteHidden=true;
    this.deleteHidden={display:'none'};
  }

  cover2Show(){
    this.deleteHidden2={display:'none'};
  }


  constructor(
    private route:ActivatedRoute,
    private art:GetArticalService,
    private operator:OperatorService,
    private filter:FilterPipe,
  ) {}


  //加载更多文章
  funGetMoreArtical(){
    this.articalAdd=this.articalAdd+8;
    this.varWaitLoad=true;
    var data=JSON.stringify({categoryId:this.categoryId});
    this.art.search(data,"home/getSingleCategory",this.articalAdd)
      .subscribe(
        (data)=>{
          switch(""+data.status) {
            case "0":
              for (var  i = 0, len = data.code.length; i < len; i++)
              {
                this.categoryArtical.push(data.code[i]);
              }
              len<8 ?  this.noMore=false :this.noMore=true;
              break;
            case "1":
              this.noMore=false;
              break;
          }
          this.varWaitLoad=false;
        }
      );
  }


  ngOnInit() {

    this.webUrl=this.operator.webUrl;

    //获取传过来的目录Id
    this.categoryId=parseInt(this.route.snapshot.paramMap.get('categoryId'));

    //获取文章
    this.funGetMoreArtical();

    //获取专题信息
    var data2=JSON.stringify({categoryId:this.categoryId});
    this.operator.sumitData(data2,'home/getSingleCategoryInfo').subscribe(
      (data)=>{
        switch(""+data.status)
        {
          case "0":
            this.categoryInfo=data.code;
            console.log("目录的信息"+this.categoryInfo);
        }
      }
    );


    //jQ
    this.operator.funGoToTop("#CategoryTop");
  }

}
