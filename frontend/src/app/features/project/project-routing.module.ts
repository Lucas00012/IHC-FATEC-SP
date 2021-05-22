import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoggedGuard } from "@shared/guards/logged.guard";
import { DetailsComponent } from "./details/details.component";
import { ListComponent } from "./list/list.component";
import { ProjectComponent } from "./project.component";
import { RegisterComponent } from "./register/register.component";
import { ProjectGuard } from "./tools/project.guard";

const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "list" },
    { 
        path: "", 
        component: ProjectComponent, 
        canActivate: [LoggedGuard, ProjectGuard],
        children: [
            { path: "list", component: ListComponent },
            { path: "register", component: RegisterComponent }
        ] 
    },
    {
        path: "details/:projectId",
        component: ProjectComponent,
        canActivate: [LoggedGuard, ProjectGuard],
        children: [
            { path: "", component: DetailsComponent }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule {

}