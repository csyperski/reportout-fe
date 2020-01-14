import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'truncate' })
export class Truncate implements PipeTransform {
    transform(value: string, length: number = 35): string {
        if ( value ) {
            length = (length > 0) ? length : 35;
            if ( value.trim().length > length ) {
                return value.trim().slice(0, length) + '...';
            }
            return value;
        }
        return "";
    }
}
