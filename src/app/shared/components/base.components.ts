import {OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {DomainObject} from '../models/domainobject';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import {MessageService} from "../services/message";
import {BaseService} from "../services/baseservice";
import {isAdminUser, isLoggedIn,UserService} from "../services/user";
import {User} from "../models/user/user";
import {AppSettings} from "../models/appsettings/appsettings";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";



export class BaseComponent {

  public readonly ComponentState =  {
    NotLoaded: 0,
    Loading: 1,
    Ready: 2,
    Error: 3
  };

  state = this.ComponentState.NotLoaded;

  private dateoptions: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit'
  };

  log(msg: string): void {
    const date = new Date();
    console.log(`INFO [${date.toLocaleString('en-us', this.dateoptions)}] - ${msg}`);
  }

  error(msg: string): void {
    const date = new Date();
    console.error(`ERROR [${date.toLocaleString('en-us', this.dateoptions)}] - ${msg}`);
  }

}

export abstract class SimpleComponent extends BaseComponent implements OnInit {



  constructor(protected _messageService?: MessageService,
              protected _userService?: UserService) {
    super();
  }

  isLoggedIn(): boolean {
    return isLoggedIn();
  }

  isAdmin(): boolean {
    return isAdminUser();
  }

  getUserLocal(): User {
    return <User>JSON.parse(localStorage.getItem(AppSettings.localSettingsTokenIdUserId));
  }

  getToken(): string {
    return localStorage.getItem(AppSettings.localSettingsTokenId);
  }

  getUser(): User {
    const user = localStorage.getItem(AppSettings.localSettingsTokenIdUserId);
    if (user) {
      try {
        return <User>JSON.parse(user);
      } catch (err) {
        const msg: string = err.message || 'general exception';
        this.error(`Unable to restore user: ${msg}`);
      }
    }
    return null;
  }


  clearMessage(): void {
    if (this._messageService) {
      this._messageService.clearNotifications();
    }
  }

  clearMessagesOnInit(): boolean {
    return false;
  }

  ngOnInit() {
    if (this.clearMessagesOnInit()) {
      this.clearMessage();
    }
    this.initMenu();
  }

  protected initMenu(): void {

  }

  applyError(desc: string, title?: string, display: boolean = true): void {
    this.clearMessage();
    if (this._messageService) {
      this._messageService.pushNotification(desc, title, true);
    }
    this.error(`UI Message push:  - ${desc}`);
    if (display && this._messageService) {
      this._messageService.pushError(title, desc);
    }
  }

  applyMessage(desc: string, title?: string, display: boolean = true): void {
    this.clearMessage();
    if (this._messageService) {
      this._messageService.pushNotification(desc, title, false);
    }
    this.log(`UI Message push:  - ${desc}`);
    if (display && this._messageService) {
      this._messageService.pushMessage(title, desc);
    }
  }

  protected _handleErrorCase(err: any, msgFormat: (item: any) => string): void {
    console.log(err);
    if (err instanceof Error) {
      const error: Error = <Error>err;
      const msg: string = err.message || 'Unknown error!';
      this.applyError(msgFormat(msg));
    } else if (err instanceof HttpErrorResponse) {
      let message = 'n/a';
      if ((<HttpErrorResponse>err).error) {
        try {
          const errorResponse = <HttpErrorResponse>err;
          const details: any = errorResponse.error;
          if (details.status && details.message) {
            message = `${details.status} - ${details.message}`;
          } else {
            message = errorResponse.message;
          }
        } catch (e) {
          console.log('Failed: ' + e);
        }
      } else {
        message = (<HttpErrorResponse>err).message;
      }
      this.applyError(msgFormat(message || 'server error'));
    } else if (typeof err === 'string') {
      this.applyError(msgFormat(err));
    } else {
      const msg = 'Unknown error!';
      this.error(JSON.stringify(err));
      this.applyError(msgFormat(msg));
    }
  }
}

export abstract class CrudAddEditComponent<U extends DomainObject, T extends BaseService<U>>
  extends SimpleComponent implements OnDestroy, OnInit {

  public formModel: FormGroup;

  public isAddOperation = false;
  protected _existingId: number = null;
  protected _existingItem: U = null;

  constructor(messageService: MessageService,
              protected _service: T,
              protected _route: ActivatedRoute) {
    super(messageService);
  }

  public routerCanReuse(): boolean {
    return false;
  }

  public isFormDirty(): boolean {
    return this.formModel == null || this.formModel.dirty;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.init();
  }

  protected disabledField(fieldName: string, formGroup: FormGroup) {
    const ctrl = formGroup.get(fieldName);
    ctrl.disable();
  }

  protected enabledField(fieldName: string, formGroup: FormGroup) {
    const ctrl = formGroup.get(fieldName);
    ctrl.enable();
  }

  protected getValueFromForm(key: string): any {
    if (key) {
      return ! this.isFormComponentDisabled(key) ? this.formModel.get(key).value : this._existingItem[key];
    }
    return null;
  }

  protected isFormComponentDisabled(key: string): boolean {
    if (key) {
      return !this.formModel.get(key).enabled;
    }
    return false;
  }

  protected init(): void {

    this.log('Processing route data...');
    this.isAddOperation = this._route.snapshot.data['add'] || false;
    this.log('Processing route data: ' + this.isAddOperation);

    this.log('Processing route params...');
    this._existingId = this._route.snapshot.params[this.getIncomingIdField()] || null;
    this.log('Processing route params: ' + this._existingId);

    this.buildFormModel();
  }

  protected dateToString(date: Date): string {
    const mm = date.getUTCMonth() + 1;
    const dd = date.getUTCDate();
    return [date.getUTCFullYear(), '-', !mm[1] && '0', mm, '-', !dd[1] && '0', dd].join('');
  }

  ngOnDestroy(): void {
  }


  protected updateFormField(key: string, value: any, model: FormGroup = this.formModel): void {
    if (model && model.contains(key)) {
      this.log(`Updating form key: ${key} to ${value}`);
      (<FormControl>model.controls[key]).setValue(value);
    }
  }

  protected abstract pushItemToFormGroup(item: U, formGroup: FormGroup): void;

  protected abstract buildFormModel(): void;

  protected abstract buildObjectFromForm(): U;

  protected abstract validate(item: U): boolean;

  protected canModify(item: U): boolean {
    return this.isLoggedIn();
  }

  protected toString(item: U): string {
    if (item && item.id) {
      return item.id + '';
    }
    return '';
  }

  protected getIncomingIdField(): string {
    return 'id';
  }

  protected onSuccessSave(item: U): void {

  }

  protected onSuccessUpdate(item: U): void {

  }

  public saveSuccessMessage(item: any): string {
    return (item) ? `Item (${item}) Saved!` : 'Item saved!';
  }

  public saveFailureMessage(item: any): string {
    return (item) ? `Process Failed (${item})!` : 'Failed to save item!';
  }

  protected _handleErrorCase(err: any, msgFormat: (item: any) => string = this.saveFailureMessage): void {
    super._handleErrorCase(err, msgFormat);
  }

  onSubmit(failureHandler: () => void = () => {
  }): void {

    this.applyMessage('Attempting to commit changes...', '', false);
    if (this.formModel.valid) {

      const item: U = this.buildObjectFromForm();
      if (item != null) {
        if (this.canModify(item)) {
          try {
            if (this.validate(item)) {
              if (this.isAddOperation) {
                // Add
                this.state = this.ComponentState.Loading;
                this.applyMessage(`Attempting to add item...${this.toString(item)}`, '', false);
                this._service.add(item)
                  .pipe(finalize(() => {
                    if ( this.state !== this.ComponentState.Error ) {
                      this.state = this.ComponentState.Ready;
                    }
                  }))
                  .subscribe(
                    // Success case
                    (newItem: U) => {
                      this._existingId = newItem.id;
                      this.applyMessage(this.saveSuccessMessage(newItem.id), 'Save Successful');
                      this.onSuccessSave(newItem);
                    },
                    // Error case
                    (err) => {
                      this._handleErrorCase(err, this.saveFailureMessage);
                      failureHandler();
                    }
                  );
              } else {
                // Update
                this.state = this.ComponentState.Loading;
                this.applyMessage(`Attempting to update item...${this.toString(item)}`, '', false);
                this._service.update(item)
                  .pipe(finalize(() => {
                    if ( this.state !== this.ComponentState.Error ) {
                      this.state = this.ComponentState.Ready;
                    }
                  }))
                  .subscribe(
                    // Success case
                    updatedItem => {
                      this.applyMessage(this.saveSuccessMessage(item.id), 'Update Successful');
                      this.onSuccessUpdate(updatedItem);
                    },
                    // Error case
                    (err) => {
                      failureHandler();
                      this._handleErrorCase(err, this.saveFailureMessage);
                    }
                  );
              }
            } else {
              this.applyError('Validation failed!');
            }
          } catch (e) {
            if (e instanceof Error) {
              const error: Error = <Error>e;
              this.applyError(`Validation Error: ${error.message}`);
            } else {
              throw e;
            }
          }
        } else {
          this.applyError('You are not permitted to modify this item!');
        }
      } else {
        this.applyError('Unable to save, item is null!');
      }
    }
  }
}

export abstract class CrudListComponent<U extends DomainObject, T extends BaseService<U>>
  extends SimpleComponent implements OnInit, AfterViewInit {

  public items: U[] = [];

  public dataSource = new MatTableDataSource<U>();

  public itemToDelete: number = null;

  @ViewChild('filter', {static: false}) filterCom: ElementRef;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(messageService: MessageService,
              private _service: T) {
    super(messageService);
  }

  ngAfterViewInit(): void {
    if (this.filterCom) {
      this.filterCom.nativeElement.focus();
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadItems();
    this.log('Loading menu items...');
    this.initMenu();
  }

  public applyFilter(filterText: string): void {
    filterText = filterText.trim().toLocaleLowerCase();
    this.log(`Starting filter: ${filterText}`);
    this.dataSource.filter = filterText;
  }

  protected loadItems(): void {
    this.state = this.ComponentState.Loading;
    this._service.list().subscribe(
      objs => {
        this.items = <U[]>objs;
        this.dataSource.data = this.items;
        this.afterLoadItems();
        this.state = this.ComponentState.Ready;
      },
      err => {
        this._handleErrorCase(err, s => `Failed to load items due to: ${s}`);
        this.state = this.ComponentState.Error;
      }
    );
  }

  protected afterLoadItems(): void {

  }

  abstract initMenu(): void;

  public applyItemToDelete(id: number): void {
    this.log(`set item to remove: ${id}`);
    this.itemToDelete = id;
  }

  public deletionSuccessMessage(item: any): string {
    return (item) ? `Item (${item}) removed!` : 'Item removed!';
  }

  public deletionFailureMessage(item: any): string {
    return (item) ? `Failed to remove item (${item})!` : 'Failed to remove item!';
  }

  public deleteItem(): void {
    if (this.itemToDelete) {
      this._service.delete(this.itemToDelete).subscribe(
        // Success case
        (b: boolean) => {
          this.applyMessage(this.deletionSuccessMessage(this.itemToDelete));
          this.loadItems();
        },
        // Error case
        (err) => {
          console.log(err);
          const msg: string = err.error || err || 'Unknown error!';
          this.applyError(this.deletionFailureMessage(msg));
        }
      );
    }
  }

}
