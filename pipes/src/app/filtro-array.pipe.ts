import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroArray'
})
export class FiltroArrayPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    if(value.length === 0 || args === undefined){
      return value;
    }

    let filter = (args[0] as string).toLocaleLowerCase();
    return value.filter(
      (v: string) => v.toLocaleLowerCase().indexOf(filter) != -1
    );
  }

}
