import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'datediff'})
export class DateDiffPipe implements PipeTransform {
  transform(value: number, secondDate: number, post?: string): string {
    if (value) {


        let date2: number = Number(secondDate) || new Date().getTime();
        if ( date2 == 0 ) {
            date2 = new Date().getTime();
        }
        let postfix: string = post || '';
        let res: number = Math.abs(date2 - value);
        if ( res > 0 ) {
            let secs:number = res / 1000;
            let minutes:number = secs / 60;
            let hours:number = minutes / 60;
            let days:number = hours / 24;

            let result: string = "";
            if ( days >= 1 ) {
                result = Math.round(days) + (Math.round(days) == 1 ? " day" : " days");
            } else if ( hours >= 1 ) {
                result = Math.round(hours) + (Math.round(hours) == 1 ? " hour" : " hours");
            } else if ( minutes >= 1 ) {
                result = Math.round(minutes) + (Math.round(minutes) == 1 ? " minute" : " minutes");
            } else {
                result = Math.round(secs) > 0 ? Math.round(secs) + " seconds" : "Less than 1 second";
            }
            if ( postfix ) {
                return result + ' ' + postfix;
            }
            return result;
        }
    }
    return "";
  }
}
