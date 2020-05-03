import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  constructor(
    private readonly authentService:AuthenticationService,
    private readonly router:Router,
    public readonly _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  logOut() {
    this.authentService.logOut()
      .finally(() => {
        this.router.navigateByUrl("/auth/login");
        this.openSnackBar("Déconnecté avec succès", "Undo");
      });
  }
}
