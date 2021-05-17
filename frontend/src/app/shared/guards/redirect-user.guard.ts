import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "@core/auth/auth.service";
import { Observable, of } from "rxjs";
import { switchMap, take } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class RedirectUserGuard implements CanActivate {

    constructor(
        private _authService: AuthService,
        private _router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this._authService.isLogged$.pipe(
            take(1),
            switchMap((isLogged) => {
                if (isLogged) 
                    return this._router.navigate(["/project"]);

                return this._router.navigate(["/user", "login"]);
            })
        )
    }
}