import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@core/auth/auth.service';
import { Meeting } from '@core/entities/database-entities';
import { ProjectFeatureService } from '@features/project/tools/project-feature.service';
import { Subject } from 'rxjs';
import { map, pluck, take, takeUntil, tap } from 'rxjs/operators';
import { EditMeetingDialogComponent } from '../edit-meeting-dialog-component/edit-meeting-dialog-component.component';

@Component({
  selector: 'app-display-meeting',
  templateUrl: './display-meeting.component.html',
  styleUrls: ['./display-meeting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayMeetingComponent implements OnDestroy {

  constructor(
    private _projectFeatureService: ProjectFeatureService,
    private _authService: AuthService,
    private _dialog: MatDialog
  ) { }

  ngOnDestroy() {
    this._destroy$.next(),
    this._destroy$.complete()
  }

  @Input() meeting!: Meeting;

  allocation$ = this._projectFeatureService.currentAllocation$;

  userId$ = this._authService.user$.pipe(
    map((user) => user.id)
  );

  private _destroy$ = new Subject();

  showDetails(){
    this.userId$.pipe(
      take(1),
      takeUntil(this._destroy$),
      tap((userId) => this._dialog.open(EditMeetingDialogComponent, {
        width: '700px',
        height: '600px',
        data: {
          meeting: this.meeting,
          currentUserIsCreator: this.meeting.creatorId == userId
        }
      }))
    ).subscribe();
  }
}
