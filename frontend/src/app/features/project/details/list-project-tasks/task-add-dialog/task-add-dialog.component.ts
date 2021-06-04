import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '@core/api/users.api';
import { AuthService } from '@core/auth/auth.service';
import { User } from '@core/entities/database-entities';
import { TaskStatus, TaskType } from '@core/entities/value-entities';
import { ProjectFeatureService } from '@features/project/tools/project-feature.service';
import { fromForm, insensitiveContains } from '@shared/utils/utils';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-task-add-dialog',
  templateUrl: './task-add-dialog.component.html',
  styleUrls: ['./task-add-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskAddDialogComponent {

  constructor(
    private _dialogRef: MatDialogRef<TaskAddDialogComponent>,
    private _fb: FormBuilder,
    private _projectFeatureService: ProjectFeatureService,
    private _authService: AuthService,
  ) { }

  form = this._fb.group({
    title: ["", [Validators.required, Validators.maxLength(25)]],
    type: [TaskType.Task, [Validators.required]],
    description: ["", [Validators.required]],
    status: [TaskStatus.ToDo],
    userId: [null],
    epicId: [null],
    storyPoints: [null],
    minutesEstimated: [null]
  });

  get autocomplete() {
    return this.form.get("userId") as FormControl;
  }

  project$ = this._projectFeatureService.currentProject$;

  user$ = this._authService.user$;

  userOptions$ = this._projectFeatureService.usersProject$;

  epicOptions$ = this._projectFeatureService.usersProject$;

  typeOptions = Object.values(TaskType);

  autocomplete$ = fromForm(this.autocomplete);

  usersFiltered$ = combineLatest([this.autocomplete$, this.userOptions$]).pipe(
    map(([autocomplete, userOptions]) => this.filter(userOptions, autocomplete))
  );

  onSave() {
    if (this.form.invalid) return;

    this._dialogRef.close(this.form.value);
  }

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
}
