import { Component } from '@angular/core';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private _authService: AuthService
  ) { }

  user$ = this._authService.user$;
  isLogged$ = this._authService.isLogged$;
}
