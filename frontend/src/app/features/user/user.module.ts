import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { UserRoutingModule } from "./user-routing.module";

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ChangePasswordComponent
    ],
    imports: [
        SharedModule,
        UserRoutingModule
    ]
})
export class UserModule {

}