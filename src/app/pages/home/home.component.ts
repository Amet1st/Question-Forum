import { Component, OnInit } from '@angular/core';

export interface Question {
  title: string;
  text: string;
  date: Date;
  tags: Array<string>;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
  
export class HomeComponent implements OnInit {

  public posts: Array<Question> = [
    { title: 'angular forms', text: 'why i am getting error?', date: new Date(), tags: ['frontend'] }, 
    { title: 'java classes', text: 'why i am getting error?', date: new Date(), tags: ['java'] },
    { title: 'android game', text: 'why i am getting error?', date: new Date(), tags: ['android', 'java'] }
  ];

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
