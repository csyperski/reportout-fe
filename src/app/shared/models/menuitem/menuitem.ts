import {User} from "../user/user";

export class MenuItem {

  icon = 'fa-circle-thin';
  title: string;
  renderText: boolean;
  _callback: () => void;
  _shouldRender: (user: User) => boolean;

  submenu = false;

  constructor( icon: string, title: string, callback: () => void, shouldRender: (user: User) => boolean, renderText: boolean = true ) {
    this.icon = icon;
    this.title = title;
    this._callback = callback;
    this._shouldRender = shouldRender;
    this.renderText = renderText;
    this.submenu = false;
  }

  shouldRender(user: User): boolean {
    if (this._shouldRender !== null ) {
      return this._shouldRender(user);
    }
    return false;
  }

  navigate(): void {
    this._callback();
  }

}
