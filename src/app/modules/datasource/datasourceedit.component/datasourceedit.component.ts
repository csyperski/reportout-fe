import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuService} from '../../../shared/services/menu';
import {MessageService} from '../../../shared/services/message';
import {CrudAddEditComponent} from '../../../shared/components/base.components';
import {DataSourceService} from "../../../shared/services/datasource";
import {DataSource} from "../../../shared/models/datasource/datasource";
import {DataSourceSubmenu} from "../model/datasourcesubmenu";


@Component({
  selector: 'ro-ds-edit',
  templateUrl: './datasourceedit.component.html',
  styleUrls: ['./datasourceedit.component.scss'],
})
export class DataSourceEditComponent extends CrudAddEditComponent<DataSource, DataSourceService> {

  constructor(private _router: Router,
              route: ActivatedRoute,
              private _menuService: MenuService,
              messageService: MessageService,
              dataSourceService: DataSourceService) {
    super(messageService, dataSourceService, route);
  }

  onCancel(): void {
    this.onSuccessSave(null);
  }

  protected onSuccessSave(item): void {
    this._router.navigate(['/datasources/list']);
  }

  protected onSuccessUpdate(item): void {
    this.onSuccessSave(item);
  }

  protected pushItemToFormGroup(dataSource: DataSource, formGroup: FormGroup): void {
    if (dataSource) {
      this.updateFormField('name', dataSource.name, formGroup);
      this.updateFormField('driverClass', dataSource.driverClass, formGroup);
      this.updateFormField('connectionString', dataSource.connectionString, formGroup);
      this.updateFormField('userName', dataSource.userName, formGroup);
      this.updateFormField('password', dataSource.password, formGroup);
      this.updateFormField('testQuery', dataSource.testQuery, formGroup);
      this.updateFormField('limitToAdmin', dataSource.limitToAdmin, formGroup);
    }
  }

  protected buildFormModel(): void {
    this.state = this.ComponentState.Loading;
    const fb = new FormBuilder();

    this.formModel = fb.group({
      'name': ['', Validators.compose([Validators.required])],
      'driverClass': ['', Validators.compose([Validators.required] ) ],
      'connectionString': ['', Validators.compose([Validators.required] ) ],
      'userName': [''],
      'password': [''],
      'testQuery': [''],
      'limitToAdmin': [true]
    });

    if (!this.isAddOperation) {
      this.log(`Loading item: ${this._existingId}`);
      this._service.get(this._existingId).subscribe(
        // Success case
        (dataSource: DataSource) => {
          this._existingItem = dataSource;
          this.pushItemToFormGroup(dataSource, this.formModel);
          this.state = this.ComponentState.Ready;
        },
        // Error case
        (err) => {
          const msg: string = err.error || err || 'Unknown error!';
          this.applyError(`Unable to retrieve data source: ${msg}`);
          this.state = this.ComponentState.Error;
        }
      );
    } else {
      if (this._existingId) {
        this.log(`Loading item for clone: ${this._existingId}`);
        this._service.get(this._existingId).subscribe(
          // Success case
          (dataSource: DataSource) => {
            this._existingItem = dataSource;
            this.pushItemToFormGroup(dataSource, this.formModel);
            this.state = this.ComponentState.Ready;
          },
          // Error case
          (err) => {
            const msg: string = err.error || err || 'Unknown error!';
            this.applyError(`Unable to get data source: ${msg}`);
            this.state = this.ComponentState.Error;
          }
        );
      } else {
        this.state = this.ComponentState.Ready;
      }
    }
  }

  protected buildObjectFromForm(): DataSource {
    if (this.formModel && this.formModel.valid) {
      const dataSource = new DataSource();
      if (!this.isAddOperation) {
        dataSource.id = this._existingItem.id;
        dataSource.version = this._existingItem.version;
      }

      const stringFieldNames: string[] = ['name', 'driverClass', 'connectionString', 'userName', 'password', 'testQuery'];
      stringFieldNames.forEach(k => dataSource[k] = this.getValueFromForm(k));

      dataSource.limitToAdmin = this.formModel.value['limitToAdmin'];

      return dataSource;
    }
    return null;
  }

  protected validate(dataSource: DataSource): boolean {
    return dataSource && dataSource.name && dataSource.name.trim().length > 0 &&
      dataSource.driverClass && dataSource.driverClass.trim().length > 0 &&
      dataSource.connectionString && dataSource.connectionString.length >= 0;
  }

  public executeTest(): void {
    this.state = this.ComponentState.Loading;
    this.applyMessage(`Attempting to execute test: ${this._existingItem.name}...`, null, false);

    this._service.execute(this._existingId).subscribe(
      (b: boolean) => {
        if ( b ) {
          this.applyMessage('Test Successful!');
        } else {
          this.applyMessage('Test Failed!')
        }
        this.state = this.ComponentState.Ready;
      },
      // Error case
      (err) => {
        this._handleErrorCase(err, (item: any) => 'Failed to execute test.');
        this.state = this.ComponentState.Ready;
      }
    );
  }

  public initMenu(): void {
    this._menuService.announceSubMenu(new DataSourceSubmenu(this._router, u => u !== null, u => u.administrator).generate());
  }
}
