import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PrintSnackbarService{
    constructor(
        private _snackbar: MatSnackBar
    ){}

    printSuccess(msg: string) {
        return this._snackbar.open(msg, "OK",{
            panelClass: ["snackbar-success"]
        }).afterDismissed();
    }

    printError(msg: string, err: any) {
        if(!environment.production){
            console.log(err);
        }

        return this._snackbar.open(msg, "OK",{
            panelClass: ["snackbar-error"]
        }).afterDismissed();
    }
}