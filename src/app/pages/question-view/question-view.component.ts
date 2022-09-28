import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Question } from 'src/app/models/interfaces/question';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PostService } from 'src/app/shared/services/post.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.scss']
})
export class QuestionViewComponent implements OnInit, OnDestroy {

  public post: Question;
  public postId: string;
  public authorId: string;
  public isAuthor = false;
  private destroy = new Subject<boolean>();

  constructor(
    private postService: PostService,
    private usersService: UsersService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.postId = this.activatedRoute.snapshot.url[1].path;
    
    this.postService.getPost(this.postId)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        post => {
          this.post = post;
          this.getUser(post.author);
          this.checkAuthor(post.author);
        }
      );
  }

  private checkAuthor(author: string) {
    this.authService.getAuthState()
      .subscribe(user => {
        this.isAuthor = user.email === author;
      })
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
