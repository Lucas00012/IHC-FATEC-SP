import { NgModule } from "@angular/core";
import { MaterialModule } from "./material/material.module";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms"

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule
    ],
})
export class SharedModule {

}