import {Component, Input} from '@angular/core';
import {NgModel} from '@angular/forms';


@Component({
  selector: 'ro-password-message',
  styleUrls: ['./passwordmessage.component.scss'],
  template: `
    <div class="component-error" *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class PasswordMessageComponent {

  @Input('model')
  model: NgModel;

  constructor() {
  }

  get errorMessage() {
    if (this.model && this.model.dirty && this.model.invalid && this.model.errors) {
      if (this.model.errors.minlength) {
        return 'Too short';
      } else if (this.model.errors.maxlength) {
        return 'Too long';
      } else if (this.model.errors.passwordValidator) {
        return 'Password does not meet requirements';
      } else if (this.model.errors.required) {
        return 'Value is required';
      }
    }
    return null;
  }

}
