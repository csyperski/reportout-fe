import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {SimpleComponent} from "../../../shared/components/base.components";
import {MenuItem} from "../../../shared/models/menuitem/menuitem";
import {Router} from "@angular/router";
import {LoginService} from "../../../shared/services/login";
import {MessageService} from "../../../shared/services/message";
import {MenuService} from "../../../shared/services/menu";
import {Subscription} from "rxjs";
import {SystemEventService} from "../../../shared/services/systemevent";

@Component({
  selector: 'ro-navigation',
  styleUrls: ['./navigation.scss'],
  templateUrl: './navigation.html'
})
export class NavigationComponent extends SimpleComponent implements OnInit, OnDestroy {

  menuItems: MenuItem[] = [
    // Home Menu Item
    new MenuItem('fa-home', 'Home', () => this._router.navigate(['/dashboard', {}]), () => this.isLoggedIn()),
    // Reports
    new MenuItem('fa-paper-plane-o', 'Jobs', () => this._router.navigate(['/jobs', {}]), () => this.isLoggedIn()),
    // Data Source Menu Item
    new MenuItem('fa-database', 'Data Sources', () => this._router.navigate(['/datasources', {}]), () => this.isAdmin()),
    // Users Menu Item
    new MenuItem('fa-users', 'Users', () => this._router.navigate(['/users']), () => this.isAdmin())
  ];

  activeMenuItems: MenuItem[] = this.menuItems;

  logOffItem: MenuItem = new MenuItem('fa-power-off', 'Logout', () => {
    this._loginService.logout();
    this.applyMessage('Session ended', 'Logout');
    this._router.navigate(['/login', {}]);
  }, () => this.isLoggedIn());

  selectedMenuItem: MenuItem;

  private _subscription: Subscription;
  private _systemEventSubscription: Subscription;

  constructor(private _router: Router,
              private _loginService: LoginService,
              messageService: MessageService,
              private _changeDetectorRef: ChangeDetectorRef,
              private _systemEventService: SystemEventService,
              private _menuService: MenuService) {
    super(messageService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this._router.events.subscribe((val) => this._updateVisibleMenuItems());
    this._subscription = this._menuService.mainmenuNavigated$.subscribe(menu => this.updateSelectedItem(menu, false));

    this._systemEventSubscription = this._systemEventService.event$.subscribe(
      event => {
        switch (event.key) {
          case 'user:login':
          case 'user:logout':
            console.log('user login/logout called, updating menu');
            this._updateVisibleMenuItems();
            this._changeDetectorRef.detectChanges();
            break;
        }
      }
    );

  }

  private _updateVisibleMenuItems(): void {
    this.activeMenuItems = this.menuItems.filter(item => item.shouldRender(this.getUser()));
  }

  isSelected(item: MenuItem): boolean {
    return item && item === this.selectedMenuItem;
  }

  updateSelectedItem(item: MenuItem, clearPreviousAlways: boolean = true) {
    if (clearPreviousAlways) {
      this.selectedMenuItem = null;
    }
    if (item) {
        let matched: MenuItem = this.activeMenuItems.filter(m => m.title === item.title)[0];
        if (matched) {
          this.selectedMenuItem = matched;
        }
    }
  }

  navigate(item: MenuItem) {
    if (item) {
      this.updateSelectedItem(item);
      item.navigate();
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._systemEventSubscription.unsubscribe();
  }
}
