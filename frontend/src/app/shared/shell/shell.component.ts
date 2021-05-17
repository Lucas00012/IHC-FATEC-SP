import { Component, HostListener, Input } from "@angular/core";
import { AuthService } from "src/app/core/auth/auth.service";
import { User } from "src/app/core/entities/database-entities";

@Component({
    selector: "app-shell",
    templateUrl: "./shell.component.html",
    styleUrls: ["./shell.component.scss"]
})
export class ShellComponent {

    constructor(
        private _authService: AuthService
    ) { }

    @Input() user!: User | null;
    @Input() isLogged!: boolean;

    logout() {
        this._authService.logout();
    }

    showSidenavHeader = window.innerWidth < 800;
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.showSidenavHeader = window.innerWidth < 800;
    }
}