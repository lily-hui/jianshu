import { Injectable } from '@angular/core';
import { CanActivate,Router} from'@angular/router';
 import {OperatorService} from "../services/opeartor.service";
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private router:Router,
    private  operator:OperatorService

  ) {}
  canActivate() {
    /*
      var allow;
      var token=sessionStorage.getItem("token");
      var flag=sessionStorage.getItem("flag");
      var that=this;
      var data=JSON.stringify({token:token,flag:flag});
      return new Promise(function(resolve,reject){
        this.operator.sumitData(data,'manger/enter')
          .subscribe(
            (data)=> {
              console.log(JSON.stringify(data));
              switch ("" + data.status)
              {
                case "0":
                  allow=true;
                  resolve(data.code);
                  break;
                case "1":
                  that.router.navigate(['']);
                  reject('no');
              }
            }
          );
      }).then(function(math){
        return true;
      }).catch(function(da){
        that.router.navigate(['']);
        return false;
      });
      */
    return true;
  }
}
