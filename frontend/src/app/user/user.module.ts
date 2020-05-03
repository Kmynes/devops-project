import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { CoursComponent } from './cours/cours.component';
import { CardCoursComponent } from './cours/card-cours/card-cours.component';
import {MatCardModule} from '@angular/material/card'
import { MatSelectModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserComponent, 
    CoursComponent, 
    CardCoursComponent],
  imports: [
    BrowserAnimationsModule,
    MatCardModule,
    CommonModule,
    AppRoutingModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule
  ]
})
export class UserModule { }
