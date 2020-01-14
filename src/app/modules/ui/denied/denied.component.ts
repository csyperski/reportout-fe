import {Component, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import {MenuService} from '../../../shared/services/menu';
import {MessageService} from '../../../shared/services/message';
import {SimpleComponent} from '../../../shared/components/base.components';


@Component({
  templateUrl: './denied.component.html',
  styleUrls: ['./denied.component.scss']
})
export class DeniedComponent extends SimpleComponent implements OnInit {

  constructor(private _router: Router,
              private _menuService: MenuService,
              messageService: MessageService) {
    super(messageService);

  }

  ngOnInit() {
    super.ngOnInit();
    this._menuService.announceSubMenu([]);
  }

}
