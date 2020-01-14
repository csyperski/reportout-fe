import {Injectable} from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import {isAdminUser, isLoggedIn} from "../../services/user";

@Injectable()
export class UserAuthGuard implements CanActivate {

  constructor(protected _router: Router) {
  }

  canActivate(): boolean {
    if ( isLoggedIn() ) {
      return true;
    } else {
      console.log('Auth guard: no login, redirecting to login page.');
      this._router.navigate(['/login']);
    }
  }

}

@Injectable()
export class AdminAuthGuard implements CanActivate {

  constructor(protected _router: Router) {
  }

  canActivate(): boolean {
    if ( isAdminUser() ) {
      return true;
    } else {
      console.log('Auth guard: no login or user is not an administrator, redirecting to login page.');
      this._router.navigate(['/login']);
    }
  }

}
