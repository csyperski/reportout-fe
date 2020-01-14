import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
  selector: '[appPasswordValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true}]
})
export class PasswordValidatorDirective implements Validator {

  validate(control: AbstractControl): { [key: string]: any } {
    if (control.dirty) {
      const value = control.value;
      const regEx = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[\\S]{10,}$');
      if (!regEx.test(value)) {
        return {
          'passwordValidator': {
            valid: false
          }
        };
      }
    }
    return null;
  }
}
