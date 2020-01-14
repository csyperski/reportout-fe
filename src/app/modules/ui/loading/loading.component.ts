import {Component, Input} from '@angular/core';




@Component({
  selector: 'ro-loading',
  styles: [
    `.loader { padding-top: 50px; text-align: center;  }
    p { text-align: center; }`
  ],
  template: `<div class="loader">
    <i class="fa fa-cog fa-2x fa-spin"></i>
    <p *ngIf="description">{{description}}</p>
  </div>`
})
export class LoadingComponent {

  @Input() description: string;

}
