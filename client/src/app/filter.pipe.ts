import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(content: any, length: any): any {
    var reg = /<[^>]*>|<\/[^>]*>/gm;
    content=content.replace(reg,"");
    content=content.replace(/&nbsp;/g," ");
    return content.slice(0,length)+"...";
  }

}
