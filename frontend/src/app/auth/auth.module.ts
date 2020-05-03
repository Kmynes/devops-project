import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MatInputModule, 
  MatFormFieldModule,
  MatButtonModule
} from '@angular/material';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import {AuthComponent} from './auth.component';

@NgModule({
  declarations: [
    RegisterComponent, 
    LoginComponent, 
    AuthComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ]
})
export class AuthModule { }
