import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ConcrenComponent} from "./concren/concren.component";
import {CategaryComponent} from "./categary/categary.component";
import { WriteComponent } from './write/write.component';
import {ArticleComponent} from "./article/article.component"
import {HomeComponent} from "./home/home.component";
import {PersonalCenterComponent} from "./personal-center/personal-center.component";
import { RecommendAuthorComponent } from './recommend-author/recommend-author.component';
import { SevenComponent } from './seven/seven.component';
import { ThirtyComponent } from './thirty/thirty.component';
import { ThemeComponent } from './theme/theme.component';

import {AuthGuardService} from "../services/authguard.service";
import {TransComponent} from "./trans.component";

const  transRoute: Routes = [
  {
    path:'',
    component:TransComponent,
    children:[
      {path:'concern',component:ConcrenComponent},
      {path:'category/:categoryId',component:CategaryComponent},
      {path:'write',component:WriteComponent},
      {path:'artical/:id',component:ArticleComponent},
      {path:'',component:HomeComponent},
      {path:"PersonalCenter/:userId",component:PersonalCenterComponent},
      {path:"recommend",component:RecommendAuthorComponent},
      {path:"recommendAuthor",component:RecommendAuthorComponent},
      {path:"seven",component:SevenComponent},
      {path:"thirty",component:ThirtyComponent},
      {path:'theme',component:ThemeComponent}
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(transRoute)],
  exports: [RouterModule],
  providers:[AuthGuardService],
})
export  class TransRouterModule {
  constructor(private Auth:AuthGuardService){}
}
