import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Question } from 'src/app/models/interfaces/question';
import { Comment } from 'src/app/models/interfaces/comment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PostService } from 'src/app/shared/services/post.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.scss']
})
export class QuestionViewComponent implements OnInit, OnDestroy {

  public post: Question;
  public comments: Comment[];
  public postId: string;
  public authorId: string;
  public userEmail: string;
  public isAuthor = false;
  public form: FormGroup;
  private destroy = new Subject<boolean>();


  constructor(
    private postService: PostService,
    private usersService: UsersService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.postId = this.activatedRoute.snapshot.url[1].path;

    this.initForm();

    this.postService.getPost(this.postId)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        post => {
          this.post = post;
          this.getUser(post.author);
          this.checkAuthor(post.author);
        }
      );

    this.postService.getAllComments(this.postId)
      .subscribe(comments => this.comments = comments);
  }

  private initForm() {
    this.form = this.formBuilder.group({
      text: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
        ]]
    });
  }

  public onSubmit() {

    if(this.form.invalid) {
      return;
    }

    const id = this.generateId();

    const body = {
      [id]: {
        author: this.userEmail,
        text: this.form.get('text').value,
        date: new Date(),
        isSolution: false
      }
    }

    this.postService.createComment(this.postId, body)
      .subscribe(response => {
        const comment = response as {[key: string]: object}
        Object.keys(comment).map(id => {
          // @ts-ignore
          this.comments.push(response[id]);
        })
      });

    this.form.reset();
  }

  private checkAuthor(author: string) {
    this.authService.getAuthState()
      .subscribe(user => {
        this.userEmail = user.email;
        this.isAuthor = user.email === author;
      })
  }

  private getUser(email: string) {
    this.usersService.getUserByEmail(email)
      .subscribe(user => {
        this.authorId = user.id;
      })
  }

  private generateId(): string {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

}
