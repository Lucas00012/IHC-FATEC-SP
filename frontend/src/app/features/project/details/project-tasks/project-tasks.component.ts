import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ProjectsService } from "@core/api/projects.api";
import { Project } from "@core/entities/database-entities";
import { ProjectFeatureService } from "@features/project/tools/project-feature.service";
import { PrintSnackbarService } from "@shared/print-snackbar/print-snackbar.service";
import { combineLatest } from "rxjs";
import { catchError, filter, map, switchMap, tap } from "rxjs/operators";
import { TaskAddDialogComponent } from "./task-add-dialog/task-add-dialog.component";

@Component({
    selector: "app-project-tasks",
    templateUrl: "./project-tasks.component.html",
    styleUrls: ["./project-tasks.component.scss"]
})
export class ProjectTasksComponent {

    constructor(
        private _dialog: MatDialog,
        private _projectsService: ProjectsService,
        private _printService: PrintSnackbarService,
        private _projectFeatureService: ProjectFeatureService
    ) { }

    @Input() project!: Project;

    canChange$ = combineLatest([this._projectFeatureService.isProductOwner$, this._projectFeatureService.isScrumMaster$]).pipe(
        map(([isProductOwner, isScrumMaster]) => isProductOwner || isScrumMaster)
    );

    addTask() {
        this._dialog.open(TaskAddDialogComponent, {
            width: "400px",
            height: "350px"
        }).afterClosed().pipe(
            filter(body => !!body),
            map(body => [...this.project.tasks, body]),
            map(tasks => ({ tasks })),
            switchMap(tasks => this._projectsService.patch(this.project.id, tasks)),
            tap(_ => this._printService.printSuccess("Tarefa cadastrada com sucesso!")),
            tap(_ => this._projectFeatureService.notifyProjectChanges()),
            catchError(err => this._printService.printError("Erro ao cadastrar a tarefa", err))
        ).subscribe();
    }
}