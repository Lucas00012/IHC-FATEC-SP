import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meeting } from '@core/entities/database-entities';
import { ProjectFeatureService } from '@features/project/tools/project-feature.service';
import { EditMeetingDialogComponent } from '../edit-meeting-dialog-component/edit-meeting-dialog-component.component';

@Component({
  selector: 'app-display-meeting',
  templateUrl: './display-meeting.component.html',
  styleUrls: ['./display-meeting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayMeetingComponent {

  constructor(
    private _projectFeatureService: ProjectFeatureService,
    private _dialog: MatDialog
  ) { }

  @Input() meeting!: Meeting;

  allocation$ = this._projectFeatureService.currentAllocation$;

  showDetails(){
    this._dialog.open(EditMeetingDialogComponent, {
      width: '700px',
      height: '600px',
      data: {
        meeting: this.meeting,
        currentUserIsCreator: this._projectFeatureService.currentAllocation$["userId"] == this.meeting.creatorId
      }
    });
  }
}
