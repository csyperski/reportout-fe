import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'yesNo' })
export class YesNoPipe implements PipeTransform {

  transform(val: boolean): string {
    return val ? 'Yes' : 'No';
  }
}
