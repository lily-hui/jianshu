import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from "@angular/http";
import { CommonModule }     from '@angular/common';
import { FormsModule } from '@angular/forms';
import {FilterPipe} from "./filter.pipe";

import { FileUploadModule } from 'ng2-file-upload';

import { TransComponent } from './trans.component';
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

import {OperatorService} from "../services/opeartor.service";


import {TransRouterModule} from "./trans.router";
@NgModule({
  declarations: [
    FilterPipe,
    TransComponent,
    HomeComponent,
    CategaryComponent,
    ConcrenComponent,
    WriteComponent,
    SevenComponent,
    ThirtyComponent,
    ArticleComponent,
    ThemeComponent,
    RecommendAuthorComponent,
    PersonalCenterComponent,
  ],
  imports: [
    FileUploadModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    TransRouterModule,
  ],
  providers: [OperatorService],
  bootstrap: [TransComponent]
})
export class TransModule { }
