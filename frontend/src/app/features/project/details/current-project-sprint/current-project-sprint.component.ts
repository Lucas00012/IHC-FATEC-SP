import { Component, Input, OnInit } from '@angular/core';
import { SprintsService } from '@core/api/sprint.api';
import { AuthService } from '@core/auth/auth.service';
import { ProjectFeatureService } from '@features/project/tools/project-feature.service';
import { PrintSnackbarService } from '@shared/print-snackbar/print-snackbar.service';
import { combineLatest } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-current-project-sprint',
  templateUrl: './current-project-sprint.component.html',
  styleUrls: ['./current-project-sprint.component.scss']
})
export class CurrentProjectSprintComponent {

  constructor(
    private _projectFeatureService: ProjectFeatureService,
    private _sprintsService: SprintsService,
    private _authService: AuthService,
    private _printService: PrintSnackbarService
  ) { }

  @Input() projectId!: number | null;

  isProductOwner$ = this._projectFeatureService.isProductOwner$;
  isScrumMaster$ = this._projectFeatureService.isScrumMaster$;
  user$ = this._authService.user$;

  isSpecial$ = combineLatest([
    this.isProductOwner$, 
    this.isScrumMaster$
  ]).pipe(
    map(([isProductOwner, isScrumMaster]) => isProductOwner || isScrumMaster)
  );

  taskInfo$ = combineLatest([this.user$, this.isSpecial$]);

  sprint$ = this._projectFeatureService.currentSprint$.pipe(
    map((sprint) => ({ value: sprint }))
  );

  closeSprint() {
    this.sprint$.pipe(
      take(1),
      switchMap((sprint) => this._sprintsService.closeSprint(sprint.value.id)),
      tap(_ => this._printService.printSuccess("SPRINT foi fechada com sucesso!")),
      tap(_ => this._projectFeatureService.notifyProjectChanges()),
      catchError(err => this._printService.printError("Erro ao fechar a SPRINT", err))
    ).subscribe();
  }
}
