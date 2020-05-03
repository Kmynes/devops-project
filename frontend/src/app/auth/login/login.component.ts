import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  constructor(private readonly authService:AuthenticationService,
    private readonly formBuilder:FormBuilder,
    private readonly router:Router,
    public readonly _snackBar: MatSnackBar
    ) {
      this.createLoginForm();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email:[''],
      password:['']
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
      .then(({data}:any) => {
        localStorage.setItem("jwtToken", data);
        this.router.navigateByUrl("/user");
      }).catch(({error}) => {
        this.openSnackBar(error.data, "Error");
      });
    return false;
  }
}
