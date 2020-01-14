import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuService} from '../../../shared/services/menu';
import {MessageService} from '../../../shared/services/message';
import {CrudAddEditComponent} from '../../../shared/components/base.components';
import {ValidatorService} from '../../../shared/services/validator';
import {UserSubmenu} from '../model/usersubmenu';
import {UserService} from "../../../shared/services/user";
import {User} from "../../../shared/models/user/user";


@Component({
  selector: 'ro-user-edit',
  templateUrl: './useredit.component.html',
  styleUrls: ['./useredit.component.scss'],
})
export class UserEditComponent extends CrudAddEditComponent<User, UserService> {

  constructor(private _router: Router,
              route: ActivatedRoute,
              private _menuService: MenuService,
              messageService: MessageService,
              userService: UserService) {
    super(messageService, userService, route);
  }

  onCancel(): void {
    this.onSuccessSave(null);
  }

  protected onSuccessSave(item): void {
    this._router.navigate(['/users/list']);
  }

  protected onSuccessUpdate(item): void {
    this.onSuccessSave(item);
  }

  protected pushItemToFormGroup(user: User, formGroup: FormGroup): void {
    if (user) {
      this.updateFormField('email', user.email, formGroup);
      this.updateFormField('firstName', user.firstName, formGroup);
      this.updateFormField('lastName', user.lastName, formGroup);
      this.updateFormField('password', user.password, formGroup);
      this.updateFormField('enabled', user.enabled, formGroup);
      this.updateFormField('administrator', user.administrator, formGroup);
      this.updateFormField('passwordChangeRequested', user.passwordChangeRequested, formGroup);
    }
  }

  protected buildFormModel(): void {
    this.state = this.ComponentState.Loading;
    const fb = new FormBuilder();

    this.formModel = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'firstName': ['', Validators.compose([Validators.required, Validators.maxLength(99), Validators.minLength(1)] ) ],
      'lastName': ['', Validators.compose([Validators.required, Validators.maxLength(99), Validators.minLength(1)] ) ],
      'password': ['', Validators.compose([Validators.minLength(0), Validators.maxLength(40)])],
      'enabled': [true ],
      'administrator': [false],
      'passwordChangeRequested': [false]
    });

    if (!this.isAddOperation) {
      this.log(`Loading item: ${this._existingId}`);
      this._service.get(this._existingId).subscribe(
        // Success case
        (user: User) => {
          this._existingItem = user;
          this.pushItemToFormGroup(user, this.formModel);
          this.state = this.ComponentState.Ready;
        },
        // Error case
        (err) => {
          const msg: string = err.error || err || 'Unknown error!';
          this.applyError(`Unable to retrieve admin user: ${msg}`);
          this.state = this.ComponentState.Error;
        }
      );
    } else {
      if (this._existingId) {
        this.log(`Loading item for clone: ${this._existingId}`);
        this._service.get(this._existingId).subscribe(
          // Success case
          (user: User) => {
            this._existingItem = user;
            this.pushItemToFormGroup(user, this.formModel);
            this.state = this.ComponentState.Ready;
          },
          // Error case
          (err) => {
            const msg: string = err.error || err || 'Unknown error!';
            this.applyError(`Unable to get admin user: ${msg}`);
            this.state = this.ComponentState.Error;
          }
        );
      } else {
        this.state = this.ComponentState.Ready;
      }
    }
  }

  protected buildObjectFromForm(): User {
    if (this.formModel && this.formModel.valid) {
      const user = new User();
      if (!this.isAddOperation) {
        user.id = this._existingItem.id;
        user.version = this._existingItem.version;
      }

      const stringFieldNames: string[] = ['email', 'firstName', 'lastName', 'password'];
      stringFieldNames.forEach(k => user[k] = this.getValueFromForm(k));

      user.enabled = this.formModel.value['enabled'];
      user.administrator = this.formModel.value['administrator'];
      user.passwordChangeRequested = this.formModel.value['passwordChangeRequested'];

      return user;
    }
    return null;
  }

  protected validate(user: User): boolean {
    return user && user.email && user.email.trim().length > 0 && user.firstName && user.firstName.length >= 0 && user.lastName &&
       user.lastName.length > 0;
  }

  public initMenu(): void {
    this._menuService.announceSubMenu(new UserSubmenu(this._router, u => u !== null, u => u.administrator).generate());
  }
}
