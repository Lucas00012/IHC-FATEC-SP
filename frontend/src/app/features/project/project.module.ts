import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { DetailsComponent } from "./details/details.component";
import { ProjectTasksComponent } from "./details/project-tasks/project-tasks.component";
import { ListComponent } from "./list/list.component";
import { ProjectRoutingModule } from "./project-routing.module";
import { ProjectComponent } from "./project.component";
import { RegisterComponent } from './register/register.component';
import { ProjectFeatureService } from "./tools/project-feature.service";
import { ProjectGuard } from "./tools/project.guard";
import { TaskAddDialogComponent } from './details/project-tasks/task-add-dialog/task-add-dialog.component';

@NgModule({
    declarations: [
        ProjectComponent,
        ListComponent,
        RegisterComponent,
        DetailsComponent,
        ProjectTasksComponent,
        TaskAddDialogComponent
    ],
    imports: [
        SharedModule,
        ProjectRoutingModule
    ],
    providers: [
        ProjectFeatureService,
        ProjectGuard
    ]
})
export class ProjectModule {

}