import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { 
  trigger, 
  style, 
  transition, 
  state, 
  animate 
} from '@angular/animations';
import { Cours } from "./Cours";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css'],
  animations:[
    trigger("fadeIn", [
      state("void", style({opacity:0})),
      transition("void <=> *", [
        animate(1000)
      ])
    ])
  ]
})
export class CoursComponent implements OnInit {
  public courses = [
    "Français",
    "Algo",
    "Anglais",
    "EPS",
    "Espagnol",
    "Histoire-Géo",
    "Math",
    "Physique",
    "SVT"
  ];

  private selected = this.courses.slice(0, 3);
  public userCourses:Cours[]
  public userCoursesFiltered:Cours[]
  public otherCourses:Cours[]
  public otherCoursesFiltered:Cours[]
  public status:string
  public name:string

  public userCoursesCurrentFilter = this.selected;
  public otherCoursesCurrentFilter = this.selected;
  constructor(private readonly http:HttpClient, 
    private readonly authService:AuthenticationService,
    public readonly _snackBar: MatSnackBar) { 
    this.userCourses          = [];
    this.userCoursesFiltered  = [];
    this.otherCourses         = [];
    this.otherCoursesFiltered = [];
  }

  private beginWithVowel(name:string) {
    return ["a", "e", "i", "o", "u", "y"].includes(name.toLowerCase()[0])
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnInit() {
    this.authService.isLogged();
    this.getInfos();
  }

  filterUserCourses(event:any) {
    this.userCoursesCurrentFilter = event.value;
    this.userCoursesFiltered = this.userCourses
      .filter(c => this.userCoursesCurrentFilter.includes(c.subject));
  }

  filterOtherCourses(event:any) {
    this.otherCoursesCurrentFilter = event.value;
    this.otherCoursesFiltered = this.otherCourses
      .filter(c => this.otherCoursesCurrentFilter.includes(c.subject));
  }

  getInfos() {
    const token = localStorage.getItem("jwtToken");
    const options = {
      headers:new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
      })
    };

    this.http.get("/user/infos", options)
    .toPromise()
    .then((resp:any) => {

      this.userCourses = resp.userCourses
        .map(c => {
          return {...c, date:new Date(c.date)};
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      this.userCoursesFiltered = this.userCourses
        .filter(c => this.selected.includes(c.subject))

      this.otherCourses = resp.otherCourses
        .map(c => {
          return {...c, date:new Date(c.date)};
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      this.otherCoursesFiltered = this.otherCourses
        .filter(c => this.selected.includes(c.subject))

      this.status = resp.status;
      this.name = resp.name;
    }).catch((err:any) => {
      console.error(err);
      this.openSnackBar(err.error.data, "Error");
    });
  }

  register(cours_id:string) {
    const token = localStorage.getItem("jwtToken");
    const options = {
      headers:new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
      })
    };

    this.http.patch("/user/addCours", {cours_id} ,options)
      .toPromise()
      .then(() => {
        let cours;
        let indexEof =  this.otherCoursesFiltered.findIndex(c => c._id === cours_id);
        this.otherCoursesFiltered.splice(indexEof, 1);
        indexEof = this.otherCourses.findIndex(c => c._id === cours_id);
        cours = this.otherCourses[indexEof];
        this.otherCourses.splice(indexEof, 1);
        this.userCourses.push(cours);

        if (this.userCoursesCurrentFilter.includes(cours.subject)) {
          this.userCoursesFiltered.push(cours);
          this.userCoursesFiltered = this.userCoursesFiltered
            .sort((a, b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime());
        }

        const msg = `Vous êtes inscris au cours d${this.beginWithVowel(cours.subject) ? "'" : "e "}${cours.subject} du professeur ${cours.teacher}`;
        this.openSnackBar(msg, "Success");
      })
      .catch(error => {
        console.log(error);
        if (error.error)
          this.openSnackBar(error.error.data, "Error");
      });
  }

  unregister(cours_id:string) {
    const token = localStorage.getItem("jwtToken");
    const options = {
      headers:new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
      })
    };

    this.http.patch("/user/removeCours", {cours_id} ,options)
      .toPromise()
      .then(() => {
        let cours;
        let indexEof = this.userCoursesFiltered.findIndex(c => c._id === cours_id);
        this.userCoursesFiltered.splice(indexEof, 1);

        indexEof = this.userCourses.findIndex(c => c._id === cours_id);
        cours    = this.userCourses[indexEof];
        this.userCourses.splice(indexEof, 1);

        this.otherCourses.push(cours);

        if (this.otherCoursesCurrentFilter.includes(cours.subject)) {
          this.otherCoursesFiltered.push(cours);
          this.otherCoursesFiltered = this.otherCoursesFiltered
          .sort((a, b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime());
        }

        const msg = `Vous êtes désinscris du cours d${this.beginWithVowel(cours.subject) ? "'" : "e "}${cours.subject} du professeur ${cours.teacher}`;
        this.openSnackBar(msg, "Success");
      })
      .catch(error => {
        console.log(error);
        if (error.error)
        this.openSnackBar(error.error.data, "Error");
      });
  }
}