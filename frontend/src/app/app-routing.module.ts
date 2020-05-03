import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserComponent } from './user/user.component';
import {AuthComponent} from "./auth/auth.component";
import { CoursComponent } from './user/cours/cours.component';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";

const childrenAuth = [
  {
    path:"",
    component:LoginComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  }
];

const routes: Routes = [
  {
    path:'',
    component:AuthComponent,
    children:[...childrenAuth]
  },
  {
    path:"auth",
    component:AuthComponent,
    children:[...childrenAuth]
  },
  {
    path:'user',
    component:UserComponent,
    children:[
      {
        path:'',
        component:CoursComponent
      },
      {
        path:"cours",
        component:CoursComponent
      }
    ]
  },
  {
    path:'**',
    component:NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
