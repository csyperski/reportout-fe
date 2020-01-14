import {Component, Host, Input} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';
import {ValidatorService} from "../../../shared/services/validator";


@Component({
  selector: 'ro-error-message',
  styleUrls: ['./errormessage.component.scss'],
  template: `<div class="component-error" *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class ErrorMessageComponent {

  @Input('formGroup')
  formGroup: FormGroup;

  @Input()
  controlName: string;

  @Input()
  customErrorMessage: string;

  constructor() {
  }

  get errorMessage() {
    const c: AbstractControl = this.formGroup.controls[this.controlName];
    if ( c ) {
      for (const propertyName in c.errors) {
        if (c.errors.hasOwnProperty(propertyName) && c.touched) {
          return this.customErrorMessage || ValidatorService.getValidatorErrorMessage(propertyName);
        }
      }
    } else {
      console.log(`Unable to locate control named: ${this.controlName}`);
    }
    return null;
  }

}
