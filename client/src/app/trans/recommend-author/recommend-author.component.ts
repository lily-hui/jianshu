import { Component, OnInit } from '@angular/core';
import {GetArticalService} from "../../services/getartical.service";
import {FilterPipe} from "../../filter.pipe";
import {OperatorService} from "../../services/opeartor.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-recommend-author',
  templateUrl: './recommend-author.component.html',
  styleUrls: ['./recommend-author.component.css'],
  providers:[OperatorService,GetArticalService,FilterPipe]
})
export class RecommendAuthorComponent implements OnInit {

  webUrl;
  recommendAuthor=new Array();//返回的数据
  page:number=-12;
  noMore:boolean=true;
  constructor(
    private art:GetArticalService,
    private filter:FilterPipe,
    private operator:OperatorService,
    private router:Router,
  ) { }

  funGetMore(data){
    var that=this;
    this.page+=12;
    this.art.search(data,'home/recommendAuthor',this.page).subscribe(
      (data)=>{
        switch(""+data.status)
        {
          case "0":
            for(var i=0,len=data.code.length;i<len;i++)
            {
              that.recommendAuthor.push(data.code[i]);
            }
            len<12 ? that.noMore=false:that.noMore=true;
            break;
          case "1":
            that.noMore=false
        }
      }
    );
  }

  ngOnInit() {
    this.webUrl=this.operator.webUrl;
    if(sessionStorage.getItem("token"))
    {
      var token=sessionStorage.getItem('token');
      var data=JSON.stringify({token:token});
      this.funGetMore(data);
    }
    else
    {
      var data=JSON.stringify({name:'无意义参数'});
      this.funGetMore(data);
    }
  }

  //添加关注
  funAddFollow(id,ev){
    //任何人的关注与取消关注
    if(sessionStorage.getItem("token"))
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
        console.log("作者的id:"+id);
        if(val=='关注'){flag=1;}
        else{flag=2;}
      var token=sessionStorage.getItem("token");
      var data=JSON.stringify({token:token,flag:flag});
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
      this.router.navigate(['../login']);
    }



  }
}
