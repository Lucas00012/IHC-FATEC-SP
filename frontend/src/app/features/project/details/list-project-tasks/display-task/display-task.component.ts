import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { Project, Task, User } from '@core/entities/database-entities';
import { ProjectFeatureService } from '@features/project/tools/project-feature.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-display-task',
  templateUrl: './display-task.component.html',
  styleUrls: ['./display-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayTaskComponent {

  constructor(
    private _projectFeatureService: ProjectFeatureService,
  ) { }

  @Input() task!: Task;
  @Input() isSpecial!: boolean;
  @Input() isTaskAssigned!: boolean;

  usersProject$ = this._projectFeatureService.usersProject$;

  userTask$ = this.usersProject$.pipe(
    map((users) => users.find(u => u.id == this.task.userId))
  );
}
