import {Component, OnDestroy, ChangeDetectorRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SimpleComponent} from '../../../shared/components/base.components';
import {MessageService} from '../../../shared/services/message';
import {SystemEventService} from '../../../shared/services/systemevent';
import {MenuItem} from "../../../shared/models/menuitem/menuitem";
import {MenuService} from "../../../shared/services/menu";


@Component({
  selector: 'ro-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SideBarComponent extends SimpleComponent implements OnDestroy, OnInit {

  menuItems: MenuItem[] = [];

  private _subscription: Subscription;
  private _systemEventSubscription: Subscription;

  constructor(private _menuService: MenuService,
              private _router: Router,
              private _changeDetectorRef: ChangeDetectorRef,
              private _systemEventService: SystemEventService,
              messageService: MessageService) {
    super(messageService);
  }

  ngOnInit() {
    super.ngOnInit();
    this._subscription = this._menuService.submenuAnnounced$.subscribe(
      menu => {
        this.menuItems = menu.filter((item: MenuItem) => item.shouldRender(this.getUser()));
        this._changeDetectorRef.detectChanges();
      }
    );

    this._systemEventSubscription = this._systemEventService.event$.subscribe(
      event => {
        switch (event.key) {
          case 'user:login':
          case 'user:logout':
            console.log('user login/logout called, updating menu');
            this.menuItems = this.menuItems.filter((item: MenuItem) => item.shouldRender(this.getUser()));
            this._changeDetectorRef.detectChanges();
            break;
        }
      }
    );

  }

  navigate(item: MenuItem): void {
    if (item) {
      this._menuService.navigateMainMenu(item);
      item.navigate();
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._systemEventSubscription.unsubscribe();
  }
}
