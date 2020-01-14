import {Component, Input} from '@angular/core';

@Component({
  selector: 'ro-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {

  @Input() description: string;

}
