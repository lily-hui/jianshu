import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login.service";
import {GetArticalService} from "../../services/getartical.service";
import {Router} from "@angular/router";
import {FilterPipe} from "../../filter.pipe";

@Component({
  selector: 'app-concren',
  templateUrl: './concren.component.html',
  styleUrls: ['./concren.component.css'],
  providers:[LoginService,GetArticalService,FilterPipe]
})
export class ConcrenComponent implements OnInit {
  constructor(
    private art:GetArticalService,
    private route:Router
  ) {}



  ngOnInit() {
  }
}
