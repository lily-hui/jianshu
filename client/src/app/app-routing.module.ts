/**
 * Created by 李慧 on 2017/9/14.
 */


import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import {SearchComponent} from "./search/search.component";
import {NewsComponent} from "./news/news.component";
import { SetComponent } from './set/set.component';

import {AuthGuardService} from "./services/authguard.service";
import {TransComponent} from "./trans/trans.component";
const  appRoute: Routes = [
  {path:"",component:TransComponent},
  {path:"login",component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'search/:query',component:SearchComponent},
  {path:'set',component:SetComponent},
  {path:'news',component:NewsComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(appRoute)],
  exports: [RouterModule],
  providers:[AuthGuardService],
})
export  class AppRoutingModule {
  constructor(private Auth:AuthGuardService){}
}
