import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoggedGuard } from "@shared/guards/logged.guard";
import { NotLoggedGuard } from "@shared/guards/not-logged.guard";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

const routes: Routes = [
    { path: "login", component: LoginComponent, canActivate: [NotLoggedGuard] },
    { path: "register", component: RegisterComponent, canActivate: [NotLoggedGuard] },
    { path: "change-password", component: ChangePasswordComponent, canActivate: [LoggedGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {

}