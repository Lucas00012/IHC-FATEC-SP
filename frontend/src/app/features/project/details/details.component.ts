import { Component } from "@angular/core";
import { ProjectFeatureService } from "../tools/project-feature.service";

@Component({
    templateUrl: "./details.component.html",
    styleUrls: ["./details.component.scss"]
})
export class DetailsComponent {
    constructor(
        private _projectFeatureService: ProjectFeatureService
    ) { }

    project$ = this._projectFeatureService.currentProject$;
}