import { Component } from '@angular/core';
import { isLoggedIn } from "./shared/services/user";

@Component({
  selector: 'ro-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn(): boolean {
    return isLoggedIn();
  }
}
