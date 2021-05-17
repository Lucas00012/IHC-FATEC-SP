import { CommonModule } from "@angular/common";
import { InjectionToken, NgModule } from "@angular/core";
import { environment } from "src/environments/environment";

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@NgModule({
    imports: [CommonModule],
    providers: [
        {
            provide: API_BASE_URL,
            useValue: environment.apiUrl
        }
    ]
})
export class ApiModule {

}