import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/interfaces/question';
import { PostService } from 'src/app/shared/services/post.service';
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
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.postService
      .getData(this.postService.apiURL)
      .subscribe(response => console.log(response));
  }

}
