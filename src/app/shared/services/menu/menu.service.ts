import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { ReplaySubject } from 'rxjs';
import {Observable} from 'rxjs';
import {MenuItem} from "../../models/menuitem/menuitem";

@Injectable()
export class MenuService {
    private _submenuAnnouncedSource = new ReplaySubject<MenuItem[]>(5);
    private _mainMenuNavigatedSource = new Subject<MenuItem>();

    submenuAnnounced$: Observable<MenuItem[]> = this._submenuAnnouncedSource.asObservable();

    mainmenuNavigated$: Observable<MenuItem> = this._mainMenuNavigatedSource.asObservable();

    announceSubMenu(menuItems: MenuItem[]) {
        this._submenuAnnouncedSource.next(menuItems);
    }

    navigateMainMenu(menuItem: MenuItem ) {
        this._mainMenuNavigatedSource.next(menuItem);
    }
}
