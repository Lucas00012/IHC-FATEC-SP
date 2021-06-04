import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '@core/api/users.api';
import { User } from '@core/entities/database-entities';
import { Responsability } from '@core/entities/value-entities';
import { fromForm, insensitiveContains } from '@shared/utils/utils';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-allocation-dialog',
  templateUrl: './add-allocation-dialog.component.html',
  styleUrls: ['./add-allocation-dialog.component.scss']
})
export class AddAllocationDialogComponent {

  constructor(
    private _usersService: UsersService,
    private _dialogRef: MatDialogRef<AddAllocationDialogComponent>,
    private _fb: FormBuilder
  ) { }

  form = this._fb.group({
    userId: [null, [Validators.required], [this.userValidator]],
    responsability: [Responsability.Employee, [Validators.required]]
  });

  get autocomplete() {
    return this.form.get("userId") as FormControl;
  }

  autocomplete$ = fromForm(this.autocomplete);

  userOptions$ = this._usersService.getAllExceptCurrent();

  usersFiltered$ = combineLatest([this.autocomplete$, this.userOptions$]).pipe(
    map(([autocomplete, userOptions]) => this.filter(userOptions, autocomplete))
  );

  responsabilityOptions = Object.values(Responsability)
    .filter((responsability) => responsability !== Responsability.ScrumMaster);

  displayFn(users: User[], userInput: any) {
    const user = users.find(user => user.id == userInput);
    return user ? `${user.name} #${user.id}` : userInput;
  }

  filter(users: User[], userInput: string | number) {
    if (!userInput) return users;
    
    let search = userInput.toString();

    return users.filter(user =>
      insensitiveContains(user.name, search) ||
      user.id?.toString().includes(search)
    );
  }

  onSave() {
    if (this.form.invalid) return;

    this._dialogRef.close(this.form.value);
  }

  userValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.userOptions$.pipe(
      map((users) => users.some(u => u.id == control.value) ? null : { user: true })
    );
  }
}
