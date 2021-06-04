import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { User } from '@core/entities/database-entities';
import { NestedForm, valueAcessorProvider } from '@shared/nested-form/nested-form';
import { fromForm, insensitiveContains } from '@shared/utils/utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete-users',
  templateUrl: './autocomplete-users.component.html',
  styleUrls: ['./autocomplete-users.component.scss'],
  providers: [
    valueAcessorProvider(AutocompleteUsersComponent)
  ]
})
export class AutocompleteUsersComponent extends NestedForm {

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService
  ) { 
    super()
  }

  @Input() users!: User[];

  @Input() readonly = false;

  @Input() valueProperty: string;

  @Output() selected = new EventEmitter<User>();

  form = this._fb.control(null);

  autocomplete$ = fromForm(this.form);

  user$ = this._authService.user$;

  usersFiltered$ = this.autocomplete$.pipe(
    map((autocomplete) => this.filter(autocomplete))
  );

  filter(userInput: string | any) {
    if (!userInput) return this.users;
    let search = userInput.toString();

    return this.users.filter(user =>
      insensitiveContains(user.name, search) ||
      user.id.toString().includes(search)
    );
  }

  userOnChange(event) {
    const user = event.option.value as User;

    this.form.patchValue(user);
    this.selected.emit(user);
  }

  displayFn(users: User[], userInput: string | any) {
    if (this.valueProperty) {
      const user = users.find(user => user[this.valueProperty] == userInput);
      return user ? `${user.name} #${user.id}` : userInput;
    }

    return userInput && userInput.name ? `${userInput.name} #${userInput.id}` : '';
  }

  mapValue(user: User): any {
    if (this.valueProperty) return user[this.valueProperty];
    return user;
  }
}
