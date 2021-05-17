import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectUserGuard } from '@shared/guards/redirect-user.guard';

const routes: Routes = [
  { path: "", pathMatch: "full", canActivate: [RedirectUserGuard], children: [] },
  { path: "user", loadChildren: () => import("@features/user/user.module").then(m => m.UserModule) },
  { path: "help", loadChildren: () => import("@shared/help/help.module").then(m => m.HelpModule) },
  { path: "project", loadChildren: () => import("@features/project/project.module").then(m => m.ProjectModule) },
  { path: "not-found", loadChildren: () => import("@shared/not-found/not-found.module").then(m => m.NotFoundModule) },
  { path: "**", pathMatch: "full", redirectTo: "not-found" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
