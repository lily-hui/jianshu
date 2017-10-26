import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from "@angular/http";
import { CommonModule }     from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';

import {FilterPipe} from "./filter.pipe";
import {OperatorService} from "./services/opeartor.service";

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import {SearchComponent} from "./search/search.component";
import {NewsComponent} from "./news/news.component";
import { SetComponent } from './set/set.component';

import { AppRoutingModule } from './app-routing.module';

import {TransModule} from "./trans/trans.module";
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    NewsComponent,
    SetComponent,
    LoginComponent,
    SearchComponent,
    FilterPipe,
  ],
  imports: [
    FileUploadModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    TransModule,
    AppRoutingModule,
  ],
  providers: [OperatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
