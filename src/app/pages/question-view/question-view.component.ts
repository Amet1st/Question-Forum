import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Question } from 'src/app/models/interfaces/question';
import { PostService } from 'src/app/shared/services/post.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.scss']
})
export class QuestionViewComponent implements OnInit, OnDestroy {

  public post: Question;
  public authorId: string;
  private destroy = new Subject<boolean>();

  constructor(
    private postService: PostService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.url[1].path;
    
    this.postService.getPost(id)
      .pipe(takeUntil(this.destroy))
      .subscribe(
      post => {
          this.post = post;
          this.getUser(post.author);
      }
    )
    
  }

  private getUser(email: string) {
    this.usersService.getUserByEmail(email)
      .subscribe(user => {
        this.authorId = user.id;
      })
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

}
