import { Inject, Injectable } from "@angular/core";
import { ProjectsService } from "@core/api/projects.api";
import { AuthService } from "@core/auth/auth.service";
import { Responsability } from "@core/entities/value-entities";
import { BehaviorSubject, of } from "rxjs";
import { catchError, map, shareReplay, switchMap } from "rxjs/operators";

@Injectable()
export class ProjectFeatureService {
    constructor(
        private _projectsService: ProjectsService,
        private _authService: AuthService
    ) { }

    projectOptions$ = this._authService.user$.pipe(
        switchMap(user => this._projectsService.getAll(user?.id)),
        shareReplay(1)
    );

    currentProjectId$ = new BehaviorSubject<number | null>(null);

    currentProject$ = this.currentProjectId$.pipe(
        switchMap(id => {
            if (!id) return of(null);

            return this.projectOptions$.pipe(map(projects => projects.find(p => p.id == id)))
        })
    );

    currentAllocation$ = this._authService.user$.pipe(
        switchMap(user => this.currentProject$.pipe(
            map(project => project?.allocations.find(a => a.userId == user?.id))
        ))
    );

    isScrumMaster$ = this.currentAllocation$.pipe(
        map(allocation => allocation?.responsability == Responsability.ScrumMaster)
    );

    isProductOwner$ = this.currentAllocation$.pipe(
        map(allocation => allocation?.responsability == Responsability.ProductOwner)
    );

    updateCurrentProjectId(id: number | null) {
        this.currentProjectId$.next(id);
    }
}