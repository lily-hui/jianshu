import { Component, OnInit } from '@angular/core';
import {GetArticalService} from "../../services/getartical.service";
import {FilterPipe} from "../../filter.pipe";
@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.css'],
  providers:[GetArticalService,FilterPipe],
})
export class ThemeComponent implements OnInit {

  webUrl=this.art.webUrl;
  allThemeContent=new Array();
  themePage:number=-9;
  noMore:boolean=true;
  constructor(
    private art:GetArticalService
  ) { }

  funGetMoreTheme(){
    this.themePage+=9;
    var sub=JSON.stringify({name:'无效参数'});
    this.art.search(sub,"home/category/allTheme",this.themePage)
      .subscribe(
        (data)=>{
          console.log(data);
          switch(""+data.status)
          {
            case "0":
              for(let i=0,len=data.code.length;i<len;i++ )
              {
                this.allThemeContent.push(data.code[i]);
              }
              break;
            case "1":
              this.noMore=false;
              break;
          }
        }
      );
  }

  ngOnInit() {
    this.funGetMoreTheme();
  }

}
