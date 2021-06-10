import { Component, OnInit } from '@angular/core';
import { ProjectFeatureService } from '../tools/project-feature.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  constructor(
    private _projectFeatureService: ProjectFeatureService
  ) { }

  projectId$ = this._projectFeatureService.currentProjectId$;

}
