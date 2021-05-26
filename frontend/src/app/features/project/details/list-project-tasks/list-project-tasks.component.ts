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
    selector: "app-list-project-tasks",
    templateUrl: "./project-tasks.component.html",
    styleUrls: ["./project-tasks.component.scss"]
})
export class ListProjectTasksComponent {

    constructor(
        private _dialog: MatDialog,
        private _projectsService: ProjectsService,
        private _printService: PrintSnackbarService,
        private _projectFeatureService: ProjectFeatureService
    ) { }

    @Input() project!: Project;

    isProductOwner$ = this._projectFeatureService.isProductOwner$;
    isScrumMaster$ = this._projectFeatureService.isScrumMaster$;

    canAddTasks$ = combineLatest([this.isProductOwner$, this.isScrumMaster$]).pipe(
        map(([isProductOwner, isScrumMaster]) => isProductOwner || isScrumMaster)
    );

    addTask() {
        this._dialog.open(TaskAddDialogComponent, {
            width: "400px",
            height: "400px"
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