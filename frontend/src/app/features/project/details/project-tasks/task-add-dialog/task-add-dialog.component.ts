import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '@core/api/users.api';
import { AuthService } from '@core/auth/auth.service';
import { User } from '@core/entities/database-entities';
import { TaskStatus } from '@core/entities/value-entities';
import { ProjectFeatureService } from '@features/project/tools/project-feature.service';
import { fromForm, insensitiveContains } from '@shared/utils/utils';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

  form = this._fb.group({
    title: ["", Validators.required],
    description: ["", Validators.required],
    status: [TaskStatus.InProgress],
    userId: ["", Validators.required]
  });

  get autocomplete() {
    return this.form.get("userId") as FormControl;
  }

  autocomplete$ = fromForm(this.autocomplete).pipe(
    map(autocomplete => typeof autocomplete === "string" ? autocomplete : autocomplete.name)
  );

  project$ = this._projectFeatureService.currentProject$;

  loggedUser$ = this._authService.user$;

  users$ = this._usersService.getAll().pipe(
    switchMap(users => this.project$.pipe(
      map(project => users.filter(u => project?.allocations.some(a => a.userId == u.id)))
    ))
  );

  userOptions$ = combineLatest([this.autocomplete$, this.users$]).pipe(
    map(([autocomplete, users]) => this.filter(users, autocomplete))
  );

  onSave() {
    if (this.form.invalid) return;

    this._dialogRef.close(this.form.value);
  }

  displayFn(user: User) {
    return user && user.name ? user.name : '';
  }

  filter(users: User[], autocomplete: string) {
    return users.filter(user =>
      insensitiveContains(user.name, autocomplete) ||
      user.id?.toString().includes(autocomplete)
    );
  }
}
