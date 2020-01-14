import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
  selector: '[appEmailValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true}]
})
export class EmailValidatorDirective implements Validator {

  validate(control: AbstractControl): { [key: string]: any } {
    if (control.dirty) {
      const value = control.value;
      if (value) {
        const regEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!regEx.test(value)) {
          return {
            'emailValidator': {
              valid: false
            }
          };
        }
      }
    }
    return null;
  }
}
