import { Component, OnInit } from '@angular/core';
import {
  FormGroup, FormBuilder
} from "@angular/forms";
import {Router} from "@angular/router";
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  constructor(private readonly formBuilder:FormBuilder,
    private readonly authService:AuthenticationService,
    private readonly router:Router,
    public readonly _snackBar: MatSnackBar) {
    this.createRegisterForm();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnInit() {}

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      email:[''],
      password:[''],
      checkPassword:[''],
      firstName:[''],
      lastName:['']
    });
  }

  onSubmit() {
    this.authService.register(this.registerForm.value)
      .then(() => {
        this.router.navigateByUrl("/user");
      })
      .catch(({error}) => {
        this.openSnackBar(error.data, "Error");
      });
  }
}