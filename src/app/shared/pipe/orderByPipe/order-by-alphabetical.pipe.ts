import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByAlphabetical'
})
export class OrderByAlphabeticalPipe implements PipeTransform {

  transform(value: any[], propertyName: string): any[] {
    if (propertyName && value)
      return value.sort((a: any, b: any) => a[propertyName].localeCompare(b[propertyName]));
    else
      return value;
  }

}
