import { Component, OnInit, Input } from '@angular/core';
import { Cours } from '../Cours';

@Component({
  selector: 'app-card-cours',
  templateUrl: './card-cours.component.html',
  styleUrls: ['./card-cours.component.css']
})
export class CardCoursComponent implements OnInit {
  @Input() cours: Cours;
  @Input() isRegistered:boolean
  @Input() register:Function
  @Input() unregister:Function
  public name:string
  public urlImgHeader:string;
  public date:Date;
  public dateDefined:boolean;
  public coursDefined:boolean;
  constructor() {
    this.dateDefined = false;
    this.coursDefined = false;
    this.urlImgHeader = "";
  }

  ngOnInit() {
    this.name = this.cours.subject.toLowerCase();
    this.date = this.cours.date;
    this.dateDefined = true;
    this.coursDefined = true;
    this.urlImgHeader = `/card-icon/${this.name}`;
  }
}