import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '@core/api/users.api';
import { AuthService } from '@core/auth/auth.service';
import { User } from '@core/entities/database-entities';
import { TaskStatus } from '@core/entities/value-entities';
import { ProjectFeatureService } from '@features/project/tools/project-feature.service';
import { fromForm, insensitiveContains } from '@shared/utils/utils';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-task-add-dialog',
  templateUrl: './task-add-dialog.component.html',
  styleUrls: ['./task-add-dialog.component.scss']
})
export class TaskAddDialogComponent {

  constructor(
    private _dialogRef: MatDialogRef<TaskAddDialogComponent>,
    private _fb: FormBuilder,
    private _projectFeatureService: ProjectFeatureService,
    private _authService: AuthService,
    private _usersService: UsersService,
  ) { }
  
  project$ = this._projectFeatureService.currentProject$;

  user$ = this._authService.user$;

  users$ = this._usersService.getAll().pipe(
    switchMap(users => this.project$.pipe(
      map(project => users.filter(u => project?.allocations.some(a => a.userId == u.id)))
    ))
  );

  form = this._fb.group({
    title: ["", [Validators.required]],
    description: ["", [Validators.required]],
    status: [TaskStatus.InProgress],
    userId: [""]
  });

  get autocomplete() {
    return this.form.get("userId") as FormControl;
  }

  autocomplete$ = fromForm(this.autocomplete);

  usersFiltered$ = combineLatest([this.autocomplete$, this.users$]).pipe(
    map(([autocomplete, users]) => this.filter(users, autocomplete))
  );

  onSave(users: User[]) {
    if (this.form.invalid) return;

    const body = this.buildBody(users);
    this._dialogRef.close(body);
  }

  displayFn(users: User[], userInput: any) {
    const user = users.find(user => user.id == userInput);
    return user ? `${user.name} #${user.id}` : userInput;
  }

  filter(users: User[], userInput: any) {
    userInput = typeof userInput === "string" ? userInput : users.find(u => u.id == userInput)?.name;
    return users.filter(user =>
      insensitiveContains(user.name, userInput) ||
      user.id?.toString().includes(userInput)
    );
  }

  buildBody(users: User[]) {
    let body = this.form.value;
    let userExists = users.some(u => u.id == body.userId);
    let userId = userExists ? body.userId : null;

    body = { ...body, userId };

    return body;
  }
}
